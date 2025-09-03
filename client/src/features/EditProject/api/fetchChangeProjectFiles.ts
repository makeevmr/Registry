import { authorizedFetch } from "@/shared/utils";

export const fetchChangeProjectFile = async (
  projectId: string,
  fileId: number,
  files: File[],
) => {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("files", file);
  });

  const result: any = await authorizedFetch(
    "/api/project/" +
    projectId +
    "/result-files/" +
    fileId,
    {
      method: "PUT",
      body: formData,
    },
  ).then((response) => {
    if (!response.ok) return 0;
    return 1;
  });

  return result;
};
