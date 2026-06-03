import { create } from "zustand";
import { ITeam } from "../types";
import { IStudent } from "../../Student";
import { staticTeamList } from "../static";
import { IStudentDetailed } from "../../Student/types";

interface DraftTeamsState {
  teams: ITeam[];
  setTeams: (teams: ITeam[]) => void;
  addStudents: (teamIndex: number, students: number[]) => void;
  removeStudent: (teamIndex: number, studentIndex: number) => void;
  moveStudent: (
    from: { teamIndex: number; studentIndex: number },
    to: { teamIndex: number; studentIndex: number }
  ) => void;
  addTeam: () => void;
  removeTeam: (index: number) => void;
}

export const useDraftTeamsStore = create<DraftTeamsState>()((set) => ({
  teams: staticTeamList,
  addTeam: () =>
    set((state) => ({
      teams: [
        ...state.teams,
        {
          name: "Team " + state.teams.length + 1,
          students: [],
          project: null,
        },
      ],
    })),
  removeTeam: (teamIndex: number) =>
    set((state) => ({
      teams: state.teams.filter((_, index) => index != teamIndex),
    })),
  setTeams: (teams: ITeam[]) => set((state) => ({ teams })),
  addStudents: (teamIndex: number, students: number[]) =>
    set((state) => ({
      teams: state.teams.map((team, index) =>
        index == teamIndex
          ? { ...team, students: [...team.students, ...students] }
          : team
      ),
    })),
  removeStudent: (teamIndex: number, studentIndex: number) =>
    set((state) => ({
      teams: state.teams.map((team, index) =>
        index == teamIndex
          ? {
              ...team,
              students: team.students.filter(
                (_, filterStudentIndex) => studentIndex != filterStudentIndex
              ),
            }
          : team
      ),
    })),
  moveStudent: (
    from: { teamIndex: number; studentIndex: number },
    to: { teamIndex: number; studentIndex: number }
  ) =>
    set((state) => {
      const student = state.teams[from.teamIndex].students[from.studentIndex];
      const removedStudentTeams = state.teams.map((team, index) =>
        index == from.teamIndex
          ? {
              ...team,
              students: team.students.filter(
                (student, index) => index != from.studentIndex
              ),
            }
          : team
      );
      const addedStudentTeams = removedStudentTeams.map((team, index) =>
        index == to.teamIndex
          ? {
              ...team,
              students: [
                ...team.students.slice(0, to.studentIndex),
                student,
                ...team.students.slice(to.studentIndex),
              ],
            }
          : team
      );
      return { teams: addedStudentTeams };
    }),
}));
