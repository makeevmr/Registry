import { Strapi } from "@strapi/strapi";
import { userAdapter } from "../entities/User";

export default ({ strapi }: { strapi: Strapi }) => ({
  async getUsersByForm(formId: number) {
    const users = await strapi.entityService?.findMany("api::student.student", {
      filters: {
        forms: {
          form: {
            id: formId,
          },
        },
      },
      populate: {
        forms: {
          populate: {
            file: true,
            form: true,
          },
        },
      },
    });

    return userAdapter(users as any, formId);
  },

  async getUsersBySurvey() {
    const users = await strapi.entityService?.findMany("api::student.student", {
      filters: {
        survey: {
          $eq: true,
        },
      },
      populate: {
        surveyResult: {
          populate: {
            file: true,
          },
        },
      },
    });

    // Adapt users for survey (similar to form adapter but for survey)
    return (users as any[])?.map((user: any) => ({
      id: user.id,
      name: user.name,
      form: {
        data: user.surveyResult?.file ? true : false,
      },
    })) || [];
  },
});
