import { Strapi } from "@strapi/strapi";

export default ({ strapi }: { strapi: Strapi }) => ({
  index(ctx) {
    ctx.body = "";
  },

  async getUsers(ctx) {
    if (!ctx.params || !ctx.params.formId) return (ctx.body = []);

    ctx.body = await strapi
      .plugin("team-builder")
      .service("userService")
      .getUsersByForm(ctx.params.formId);
  },

  async getUsersBySurvey(ctx) {
    ctx.body = await strapi
      .plugin("team-builder")
      .service("userService")
      .getUsersBySurvey();
  },
});
