import { IForm } from "@/entities/Form";
import { IFormDTO } from "@/entities/Form/types/types";
import { IMember } from "@/entities/Member";
import { IProject, IProjectReference, ProjectDTO } from "@/entities/Project";
import { IRequest } from "@/entities/Request";
import { ITeam, ITeamExtended } from "@/entities/Team";
import { IUser } from "@/entities/User";

export interface Profile {
  forms: IForm[];
  survey: {
    id: number;
    submittedAt: string;
  } | null;
  projects: IProject[];
  requests: IRequest[];
  teams: ITeamExtended[];
  users: IUser[];
  members: IMember[];
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
}

export interface ProfileDTO {
  forms: IFormDTO[];
  survey: {
    id: number;
    submittedAt: string;
  } | null;
  projects: ProjectDTO[];
  requests: IRequest[];
  teams: ITeamExtended[];
  users: IUser[];
  members: IMember[];
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
}
