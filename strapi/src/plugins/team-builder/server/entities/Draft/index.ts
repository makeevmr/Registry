export interface Draft {
  id: number;
  name: string;
  form: number;
  activeStudents: number[];
  teams: { students: number[]; project: number | null }[];
}
