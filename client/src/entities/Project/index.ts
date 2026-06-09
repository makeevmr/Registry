import ProjectCard from "./ui/ProjectCard";
import ProjectCardAlt from "./ui/ProjectCardAlt";
import ProjectCardWithStatus from "./ui/ProjectCardWithStatus";
import { staticProjects } from "./static/staticProjects";
import {
  staticProjectSingleNotStarted,
  staticProjectSingleOngoing,
  staticProjectSingleCompleted,
} from "./static/staticProjectsSingle";
import { getProjectStage } from "./utils/getProjectStage";
import {
  getProjectSingleFromDTO,
  getProjectFromDTO,
} from "./utils/getProjectFromDTO/getProjectFromDTO";
import type {
  ProjectDTO,
  IProject,
  IProjectSingle,
  IProjectSingleDTO,
  IProjectReference,
  IProjectDocument,
  IProjectLink,
} from "./types/types";
import { ProjectStage } from "./types/types";
import { getProjectsByProjectIds } from "./model/getProjectsByProjectIds";
import { useProjectFileTypeQuery } from "./model/useProjectFileTypeQuery";
import ProjectLinkIcon from "./ui/ProjectLinkIcon";
import ProjectForm from "./ui/ProjectForm";
import type {
  ProjectFormInitialValues,
  ProjectFormSubmitValues,
} from "./ui/ProjectForm";

export {
  ProjectCard,
  ProjectCardAlt,
  ProjectCardWithStatus,
  staticProjects,
  staticProjectSingleNotStarted,
  staticProjectSingleOngoing,
  staticProjectSingleCompleted,
  getProjectStage,
  ProjectStage,
  getProjectFromDTO,
  getProjectSingleFromDTO,
  getProjectsByProjectIds,
  useProjectFileTypeQuery,
  ProjectLinkIcon,
  ProjectForm,
};
export type {
  ProjectDTO,
  IProject,
  IProjectSingle,
  IProjectSingleDTO,
  IProjectReference,
  IProjectDocument,
  IProjectLink,
  ProjectFormInitialValues,
  ProjectFormSubmitValues,
};
