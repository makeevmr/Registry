import type {
  Project,
  ProjectWithTags,
  ProjectFilters,
  ProjectReference,
  ProjectCreate,
  ProjectUpdate,
} from "./types/types";
import {
  staticProjectList,
  staticProjectsWithTagsResult,
} from "./static/projectsWithTags";
import { getProjectFromDTO } from "./utils/getProjectFromDTO";
import { getProjectFiltersFromDTO } from "./utils/getProjectFiltersFromDTO";

export {
  staticProjectList,
  staticProjectsWithTagsResult,
  getProjectFromDTO,
  getProjectFiltersFromDTO,
};
export type {
  Project,
  ProjectWithTags,
  ProjectFilters,
  ProjectReference,
  ProjectCreate,
  ProjectUpdate,
};
