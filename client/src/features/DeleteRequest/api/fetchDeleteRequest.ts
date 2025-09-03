import { authorizedFetch } from "@/shared/utils";

export const fetchDeleteRequest = async (requestId: number) => {
  const result = await authorizedFetch(
    "/api/request/" + requestId,
    {
      method: "DELETE",
    },
  ).then((response) => {
    if (!response.ok) return 0;

    return 1;
  });

  return result;
};
