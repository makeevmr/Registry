export interface IUser {
  id: number;
  name: string;
  userType?: "student" | "employer";
}

export interface IUserWithUnassignedData extends IUser {
  unassignedTeams: number[];
  unassignedAdministrated: number[];
}
