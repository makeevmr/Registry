export const subscribe = async (email: string) => {
  const result = await fetch(process.env.NEXT_PUBLIC_SERVER_URL + "api/subscribe").then((res) => res.status);

  return result;
};
