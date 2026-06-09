import { NamedFile } from "@/shared/types";

export interface IProjectReference {
  id: string;
  name: string;
}

export type IProject = {
  id: string;
  name: string;
  description: string;
  dateStart: Date;
  dateEnd: Date;
  enrollmentStart: Date;
  enrollmentEnd: Date;
  //createdAt: Date;
  clientContact: string;
  curator: string;
  client: string;
  tags: number[];
  teams: number[];
  teamLimit: number;
};

export type ProjectDTO = {
  id: string;
  name: string;
  description: string;
  dateStart: string;
  dateEnd: string;
  enrollmentStart: string;
  enrollmentEnd: string;
  //createdAt: string;
  curator: string;
  client: string;
  clientContact: string;
  tags: number[];
  teams: number[];
  teamLimit: number;
};

export interface IProjectDocument {
  id: number;
  name: string;
  date: string;
  url: string;
  type: string;
  size: string;
  category: string;
}

export interface IProjectLink {
  id: number;
  platform: string;
  link: string;
}

export interface IProjectSingle extends IProject {
  requestCount: number;
  developerRequirements: string[];
  projectRequirements: string[];
  descriptionFiles: NamedFile[];
  resultFiles: NamedFile[];
  documents: IProjectDocument[];
  related: IProject[];
  links: IProjectLink[];
  employerOwner: number | null;
}

export interface IProjectSingleDTO extends ProjectDTO {
  requestCount: number;
  developerRequirements: string[];
  projectRequirements: string[];
  descriptionFiles: NamedFile[];
  resultFiles: NamedFile[];
  documents: {
    id: number;
    name: string;
    date: string;
    url: string;
    type: string;
    size: string;
    category: string;
  }[];
  related: ProjectDTO[];
  links: {
    id: number;
    platform: string;
    link: string;
  }[];
  employerOwner: number | null;
}

export enum ProjectStage {
  hiring,
  active,
  completed,
}
