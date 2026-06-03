import { Strapi } from "@strapi/strapi";
import { TeamToSave } from "../entities/Team";
import { User, formatName } from "../entities/User";

export default ({ strapi }: { strapi: Strapi }) => ({
  async generateTeams(teams: TeamToSave[]) {
    const createTeamsResponse = await strapi.db
      ?.query("api::team.team")
      .createMany({
        data: teams.reduce<{ publishedAt: Date | number; name: string }[]>(
          (data, team) => [
            ...data,
            {
              name: team.students
                .map((user) => formatName(user.name))
                .join(", "),
              publishedAt: Date.now(),
            },
          ],
          []
        ),
      });

    if (!createTeamsResponse) throw new Error("Failed to generate teams");

    const { ids: teamIds } = createTeamsResponse;

    const generateMember = async (user: User, teamId: string | number) => {
      return strapi.entityService?.create("api::user-in-team.user-in-team", {
        data: {
          user: user.id,
          team: teamId,
          roles: [],
          name: user.name,
          publishedAt: Date.now(),
        },
      });
    };

    const result = await Promise.all(
      teams.reduce<Promise<any>[]>(
        (promises, team, index) => [
          ...promises,
          ...team.students.map((student) =>
            generateMember(student, teamIds[index])
          ),
        ],
        []
      )
    );

    await Promise.all(
      teams.map((team, index) =>
        team.project != null
          ? strapi.entityService?.update(
              "api::team.team",
              teamIds[index] as number,
              {
                data: { project: team.project } as any,
              }
            )
          : null
      )
    );

    return result;
  },
});
