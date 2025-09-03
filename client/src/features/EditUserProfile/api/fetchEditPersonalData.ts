import { authorizedFetch } from "@/shared/utils";

export const fetchEditPersonalData = async (data: {
  fullName: {
    name: string;
    surname: string;
    patronymic: string;
  };
}) => {
  const response = await authorizedFetch(
    "/api/profile/personal",
    {
      method: "PUT",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: data.fullName.name,
        surname: data.fullName.surname,
        patronymic: data.fullName.patronymic,
      }),
    },
  ).then((res) => {
    if (res.status !== 200)
      throw new Error("Failed to update user personal data");

    return res.status;
  });

  return response;
};
