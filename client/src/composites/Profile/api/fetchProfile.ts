import { authorizedFetch } from "@/shared/utils";
import { Profile, ProfileDTO } from "../types/types";
import { getProjectFromDTO } from "@/entities/Project";
import { getFormFromDTO } from "@/entities/Form";

export const fetchProfile = async (): Promise<Profile | null> => {
  const result: ProfileDTO | null = await authorizedFetch(
    "/api/user/profile",
  ).then((response) => {
    try {
      return response.ok ? response.json() : null;
    } catch {
      return null;
    }
  });

  return result
    ? {
      ...result,
      projects: result.projects.map((project) => getProjectFromDTO(project)),
      forms: result.forms.map((form) => getFormFromDTO(form)),
    }
    : null;
};
