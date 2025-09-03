import { authorizedFetch } from "@/shared/utils";

export const fetchEditAccountData = async (data: {
  email: string;
  phone: string;
}) => {
  const response = await authorizedFetch(
    "/api/profile/account",
    {
      method: "PUT",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: data.email,
        phone: data.phone,
      }),
    },
  ).then((res) => {
    if (res.status !== 200)
      throw new Error("Failed to update user account data");

    return res.status;
  });

  return response;
};
