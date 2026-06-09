import { NamedFile } from "@/entities/components/named-file";
import { ProjectDocument } from "@/entities/components/project-document";
import { Tag } from "@/entities/tag";

export interface ProjectReference {
  id: string;
  name: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  dateStart: Date;
  dateEnd: Date;
  enrollmentStart: Date;
  enrollmentEnd: Date;
  //createdAt: Date;
  curator: string;
  client: string;
  clientContact: string;
  tags: number[];
  teams: number[];
  teamLimit: number | null;
  resultFiles?: NamedFile[] | null;
  documents?: ProjectDocument[] | null;
}

export interface ProjectDTO {
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
  teamLimit: number | null;
}

// Payload sent by an employer creating a project. `shortName` is English-only
// (A-Z, a-z, spaces) and used solely to build the slug; it is not persisted.
// `tags` are existing tag names, resolved to ids server-side.
export interface ProjectCreate {
  name: string;
  shortName: string;
  description: string;
  dateStart: string;
  dateEnd: string;
  enrollmentStart: string;
  enrollmentEnd: string;
  client: string;
  clientContact: string;
  tags: string[];
  // Max number of teams that can enroll. Drives the hiring/active stage.
  teamLimit: number;
  // Optional repeatable lists of free-text requirements.
  developerRequirements?: string[];
  projectRequirements?: string[];
}

// Editable fields on an existing project. shortName/slug are immutable.
export type ProjectUpdate = Omit<ProjectCreate, "shortName">;

export interface ProjectFilters {
  text?: string;
  dateStart?: Date | null;
  dateEnd?: Date | null;
  enrollmentStart?: Date | null;
  enrollmentEnd?: Date | null;
  status?: string;
  tags?: string[];
}

export interface ProjectFiltersDTO {
  text?: string;
  dateStart?: string;
  dateEnd?: string;
  enrollmentStart?: string;
  enrollmentEnd?: string;
  status?: string;
  tags?: string[];
}

export interface ProjectDetailed extends Project {
  requestCount: number;
  developerRequirements: string[];
  projectRequirements: string[];
  descriptionFiles: NamedFile[] | null;
  resultFiles: NamedFile[] | null;
  documents: ProjectDocument[] | null;
  related: ProjectDTO[] | ProjectDetailedDTO[] | null;
  links: { id: number; platform: string; link: string }[];
  // Strapi id of the employer who owns (created) the project, if any.
  employerOwner: number | null;
}

export interface ProjectDetailedDTO extends ProjectDTO {
  requestCount: number;
  developerRequirements: string[];
  projectRequirements: string[];
  descriptionFiles: NamedFile[] | null;
  resultFiles: NamedFile[] | null;
  documents: ProjectDocument[] | null;
  related: ProjectDTO[] | ProjectDetailedDTO[] | null;
  links: { id: number; platform: string; link: string }[];
  employerOwner: number | null;
}

export interface ProjectWithTags extends Omit<Project, "tags"> {
  tags: Tag[];
}
