import { authorizedFetch } from "@/shared/utils";

export const fetchDeleteProjectFile = async (
  projectId: string,
  fileId: number,
) => {
  const result: any = await authorizedFetch(
    "/api/project/" +
    projectId +
    "/result-files/" +
    fileId,
    {
      method: "DELETE",
    },
  ).then((response) => {
    if (!response.ok) return 0;

    return 1;
  });

  return result;
};
