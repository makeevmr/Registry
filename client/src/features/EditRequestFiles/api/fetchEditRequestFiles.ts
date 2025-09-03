import { authorizedFetch } from "@/shared/utils";

export const fetchEditRequestFiles = async (
  files: File[],
  requestId: number,
) => {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("files", file);
  });

  formData.append("request", "" + requestId);

  const response = await authorizedFetch(
    "/api/request",
    {
      method: "PUT",
      body: formData,
    },
  ).then((res) => {
    if (res.status !== 200) throw new Error("Failed to send a request");

    return res.status;
  });
};
