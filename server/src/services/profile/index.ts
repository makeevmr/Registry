import { User, UserProfileData } from "@/entities/user";
import formResultService from "../form-result";
import surveyResultService from "../survey-result";
import requestRepository from "@/repositories/request";
import teamRepository from "@/repositories/team";
import { Team } from "@/entities/team";
import { Member } from "@/entities/member";
import requestService from "../request";
import projectRepository from "@/repositories/project";
import { mergeUnique } from "@/helpers/mergeUnique";
import userRepository from "@/repositories/user";
import userService from "../user";

const profileServiceFactory = () => {
  return Object.freeze({ getUserData, editAccountData, editPersonalData });

  async function editAccountData(
    data: { email: string; phone: string },
    user: User
  ) {
    return userRepository.edit(
      {
        email: data.email,
        phone: data.phone,
      },
      user.id
    );
  }

  async function editPersonalData(
    data: {
      fullName: {
        name: string;
        surname: string;
        patronymic: string;
      };
    },
    user: User
  ) {
    const name = [
      data.fullName.surname,
      data.fullName.name,
      data.fullName.patronymic,
    ].join(" ");

    return userRepository.edit(
      {
        name,
      },
      user.id
    );
  }

  async function getUserData(user: User): Promise<UserProfileData> {
    const [
      userResult,
      formsResult,
      surveyResult,
      requestsResult,
      activeTeamsResult,
      activeAdministratedTeamsResult,
    ] = await Promise.allSettled([
      userService.findById(user.id),
      formResultService.getAllByUser(user),
      surveyResultService.findByUser(user.id),
      requestRepository.getActive({ user: user.id }), // not all the requests associated with each team
      teamRepository.getActive(user.id, {
        includeAdmin: true,
        includeAllDocuments: true,
      }), // is considered 'active', hence the separate calls
      teamRepository.getAdministratedActive(user.id, {
        includeAdmin: true,
        includeAllDocuments: true,
      }),
    ]);

    const userData =
      userResult.status == "fulfilled" ? userResult.value || null : null;

    const nameArray = userData?.name?.split(" ") || [];

    const forms =
      formsResult.status == "fulfilled" ? formsResult.value || [] : [];

    const survey =
      surveyResult.status == "fulfilled" ? surveyResult.value || null : null;

    const requests =
      requestsResult.status == "fulfilled"
        ? requestsResult.value && requestsResult.value.requests
          ? requestsResult.value.requests
          : []
        : [];

    const { teams, members, users } =
      activeTeamsResult.status == "fulfilled"
        ? activeTeamsResult.value
        : { teams: [] as Team[], members: [] as Member[], users: [] as User[] };

    const {
      teams: adminTeams,
      members: adminMembers,
      users: adminUsers,
    } = activeAdministratedTeamsResult.status == "fulfilled"
      ? activeAdministratedTeamsResult.value
      : { teams: [] as Team[], members: [] as Member[], users: [] as User[] };

    const teamsPopulated = teams
      ? requestService.populateTeams(teams, requests)
      : [];
    const adminTeamsPopulated = adminTeams
      ? requestService.populateTeams(adminTeams, requests)
      : [];

    const usedProjectIds = teams
      ? teams
          .filter((team) => team.project)
          .map((team) => team.project!)
          .concat(
            requests.reduce(
              (acc, cur) => (cur.project ? [...acc, cur.project] : acc),
              [] as string[]
            )
          )
      : [];

    const projects = teams
      ? await projectRepository.getReferences(usedProjectIds, {
          includeAllDocuments: true,
          includeAdmin: true,
        })
      : [];

    return {
      forms,
      survey: survey
        ? {
            id: 1,
            submittedAt: survey.date,
          }
        : null,
      requests,
      teams: mergeUnique(teamsPopulated, adminTeamsPopulated),
      members: mergeUnique(members, adminMembers),
      users: mergeUnique(users, adminUsers),
      projects: projects!,
      user: {
        email: userData?.email || "",
        phone: userData?.phone || "",
        fullName: {
          name: nameArray[1] || "",
          surname: nameArray[0] || "",
          patronymic: nameArray[2] || "",
        },
        teams: teamsPopulated ? teamsPopulated.map((team) => team.id) : [],
        administratedTeams: adminTeamsPopulated
          ? adminTeamsPopulated.map((team) => team.id)
          : [],
        projects:
          teams
            ?.map((team) => team.id)
            .map((teamId) =>
              projects?.find((project) => project.teams.includes(teamId))
            )
            .filter((project) => project)
            .map((project) => project!.id) || [],
      },
    };
  }
};

const profileService = profileServiceFactory();

export default profileService;
