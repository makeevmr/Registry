import { UserDetailed } from "../User";

export interface Team {
  id: number;
  name: string;
  students: UserDetailed[];
}

export interface TeamToSave {
  students: UserDetailed[];
  project?: number | null;
}
