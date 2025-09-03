/*
Receiving a 401 may mean that just the access-token is expired.
AuthorizedFetch tries to update access-token once on 401
*/
export const authorizedFetch = async (url: RequestInfo, init?: RequestInit) => {
  const url_string = typeof url === "string" ? url : url.url;
  const result = await fetch(process.env.NEXT_PUBLIC_SERVER_URL + url_string, init);
  if (result.status == 401) {
    await fetch(process.env.NEXT_PUBLIC_SERVER_URL + "/auth/token");
    const result = await fetch(process.env.NEXT_PUBLIC_SERVER_URL + url_string, init);

    return result;
  }
  return result;
};
