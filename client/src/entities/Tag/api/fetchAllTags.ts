import { authorizedFetch } from "@/shared/utils";
import { ITag } from "../types/types";

// Full list of existing tag names, for the project create/edit tags multiselect.
export const fetchAllTags = async (): Promise<string[]> => {
  const response = await authorizedFetch("/api/tag/all");

  if (!response.ok) return [];

  try {
    const tags: ITag[] = await response.json();
    return tags.map((tag) => tag.name);
  } catch {
    return [];
  }
};
