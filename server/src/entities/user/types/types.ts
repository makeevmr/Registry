import { FormResultClient } from "@/entities/form";
import { Member } from "@/entities/member";
import { Project, ProjectReference } from "@/entities/project";
import { ProjectDTO } from "@/entities/project/types/types";
import { Request } from "@/entities/request";
import { Team } from "@/entities/team";

export interface User {
  id: number;
  name: string;
  email?: string;
  phone?: string;
}

export type UserCreate = Omit<User, "id"> & {
  email: string;
};

export interface UserProjectStatusData {
  user: {
    assignableTeams: number[]; // The administrated teams that haven't applied for the project
    hasTeamApplied: boolean; // Whether there's a team that has applied (administrated or not)
  };
  teams: Team[];
}

export interface UserProfileData {
  forms: FormResultClient[];
  survey: {
    id: number;
    submittedAt: string;
  } | null;
  projects: ProjectDTO[];
  requests: Request[];
  user: {
    fullName: {
      name: string;
      surname: string;
      patronymic: string;
    };
    email: string;
    phone: string;
    teams: number[];
    administratedTeams: number[];
    projects: string[];
  };
  teams: Team[];
  users: User[];
  members: Member[];
}
