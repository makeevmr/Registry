import { authorizedFetch } from "@/shared/utils";

export const fetchAddProjectFile = async (
  projectId: string,
  teamId: number,
  file: File,
  category: string,
) => {
  const formData = new FormData();

  formData.append("category", category);
  formData.append("files", file);
  formData.append("project", "" + projectId);
  formData.append("team", "" + teamId);

  const result: any = await authorizedFetch(
    "/api/project/" +
    projectId +
    "/result-files",
    {
      method: "POST",
      body: formData,
    },
  ).then((response) => {
    if (!response.ok) return 0;
    return 1;
  });

  return result;
};
