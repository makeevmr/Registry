import { authorizedFetch } from "@/shared/utils";
import { ProjectStatusData } from "../types/types";

export const fetchProjectStatusData = async (projectId: string) => {
  const result: ProjectStatusData = await authorizedFetch(
    "/api/user/projectstatus/" + projectId,
  ).then((response) => {
    if (!response.ok)
      return {
        assignableTeams: 0,
      };
    try {
      return response.json();
    } catch {
      return { assignableTeams: 0 };
    }
  });

  return result;
};
