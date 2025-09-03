import { authorizedFetch } from "@/shared/utils";

export const fetchAddProjectLink = async (
  projectId: string,
  resource: string,
  link: string,
) => {
  const result: any = await authorizedFetch(
    "/api/project/" + projectId + "/link",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ platform: resource, link }),
    },
  ).then((response) => {
    if (!response.ok) return 0;
    return 1;
  });

  return result;
};
