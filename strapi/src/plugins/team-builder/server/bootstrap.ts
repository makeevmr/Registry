import { Strapi } from '@strapi/strapi';

export default async ({ strapi }: { strapi: Strapi }) => {
  // Create "Формирование команд" draft if it doesn't exist
  const existingDrafts = await strapi.db?.query("plugin::team-builder.draft").findMany({
    where: {
      name: "Формирование команд",
    },
  });

  if (!existingDrafts || existingDrafts.length === 0) {
    await strapi.db?.query("plugin::team-builder.draft").create({
      data: {
        name: "Формирование команд",
        survey: "Анкета ПМ-ПУ",
      },
    });
    console.log('Created "Формирование команд" draft');
  }
};
