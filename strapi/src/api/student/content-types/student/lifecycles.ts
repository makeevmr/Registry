export default {
  // When an admin changes a user's role from "student" to "employer",
  // clear all student-only data: survey, forms and team participation.
  // Identity fields (name, phone, services) are kept so the user can still log in.
  async beforeUpdate(event) {
    const incomingUserType = event.params.data?.userType;

    // Nothing to do unless this update sets the role to "employer".
    if (incomingUserType !== "employer") return;

    const id = event.params.where?.id;
    if (!id) return;

    // Cast around stale generated types: `userType` is added to the schema in
    // this same change and isn't yet in Strapi's generated content-type types.
    const existing = (await strapi.entityService.findOne(
      "api::student.student",
      id,
      { fields: ["userType"] as any }
    )) as { userType?: "student" | "employer" } | null;

    // Only run cleanup on the student -> employer transition.
    if (!existing || existing.userType === "employer") return;

    event.params.data.survey = false;
    event.params.data.surveyResult = null;
    event.params.data.forms = [];
    event.params.data.teams = [];
    event.params.data.administratedTeams = [];
  },
};
