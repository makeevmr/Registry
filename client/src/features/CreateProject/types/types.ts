export interface CreateProjectData {
  name: string;
  // English-only (A-Z, a-z, spaces); used server-side to build the slug.
  shortName: string;
  description: string;
  dateStart: string;
  dateEnd: string;
  enrollmentStart: string;
  enrollmentEnd: string;
  client: string;
  clientContact: string;
  teamLimit: number;
  tags: string[];
  developerRequirements: string[];
  projectRequirements: string[];
}
