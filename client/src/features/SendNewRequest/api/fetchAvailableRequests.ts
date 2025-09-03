import { authorizedFetch } from "@/shared/utils";

export const fetchAvailableRequests = async () => {
  const result = await authorizedFetch(
    "api/request/available",
  ).then((response) => {
    if (!response.ok) return { teams: [], projectReferences: [] };

    try {
      return response.json();
    } catch {
      return { teams: [], projectReferences: [] };
    }
  });

  return result;
};
