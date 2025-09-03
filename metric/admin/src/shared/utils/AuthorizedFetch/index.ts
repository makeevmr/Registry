/*
Receiving a 401 may mean that just the access-token is expired.
AuthorizedFetch tries to update access-token once on 401
*/
export const authorizedFetch = async (url: RequestInfo, init?: RequestInit) => {
  const result = await fetch(import.meta.env.VITE_SERVER_URL + url, init);

  if (result.status == 401) {
    await fetch(import.meta.env.VITE_SERVER_URL + "auth/refresh");
    const result = await fetch(import.meta.env.VITE_SERVER_URL + url, init);

    return result;
  }
  return result;
};
