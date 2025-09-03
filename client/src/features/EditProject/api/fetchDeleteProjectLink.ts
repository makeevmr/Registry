import { authorizedFetch } from "@/shared/utils";

export const fetchDeleteProjectLink = async (
  projectId: string,
  linkId: number,
) => {
  const result: any = await authorizedFetch(
    "/api/project/" +
    projectId +
    "/link/" +
    linkId,
    {
      method: "DELETE",
    },
  ).then((response) => {
    if (!response.ok) return 0;

    return 1;
  });

  return result;
};
