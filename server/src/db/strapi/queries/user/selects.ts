export type SelectUserOptions = {
  populate: ("teams" | "projects")[];
};

export const selectUser = () => ({
  fields: ["id", "name", "phone", "userType"],
  populate: {
    services: {
      provider: true,
      value: true,
    },
  },
});

export const selectUserRole = () => ({
  fields: ["id", "name"],
});
