import { Strapi } from "@strapi/strapi";
import { Draft } from "../entities/Draft";

export default ({ strapi }: { strapi: Strapi }) => ({
  async createDraft() {
    const createDraftResponse = await strapi.entityService?.create(
      "plugin::team-builder.draft",
      {
        data: {},
      }
    );

    if (!createDraftResponse || !createDraftResponse.id)
      throw new Error("Couldn't create a draft");

    const updateDraftResponse = await strapi.db
      ?.query("plugin::team-builder.draft")
      .update({
        where: {
          id: createDraftResponse.id,
        },
        data: {
          name: "Черновик " + createDraftResponse.id,
        },
      });

    return updateDraftResponse;
  },

  async getDrafts() {
    const findDraftsResponse = await strapi.entityService?.findMany(
      "plugin::team-builder.draft"
    );

    return findDraftsResponse;
  },

  async getDraftById(id: number | string) {
    const findDraftResponse = await strapi.entityService?.findOne(
      "plugin::team-builder.draft",
      +id,
      {
        fields: ["id", "name", "survey"],
        populate: {
          form: {
            fields: ["id"],
          },
          activeStudents: {
            fields: ["id"],
          },
          teams: {
            populate: {
              users: {
                fields: ["id"],
              },
            },
          },
        },
      }
    );

    if (!findDraftResponse) throw new Error("Couldn't find the draft");

    return findDraftResponse;
  },

  async saveDraft(data: Draft) {
    const { id: _, teams, ...dataToSave } = data;

    const updateDraftResponse = await strapi.db
      ?.query("plugin::team-builder.draft")
      .update({
        where: {
          id: data.id,
        },
        data: dataToSave,
      });

    const findDraftTeamsResponse = await strapi.db
      ?.query("plugin::team-builder.team-draft")
      .findMany({
        where: {
          draft: {
            id: data.id,
          },
        },
      });

    if (findDraftTeamsResponse) {
      for (const teamDraft of findDraftTeamsResponse) {
        strapi.db?.query("plugin::team-builder.team-draft").delete({
          where: {
            id: teamDraft.id,
          },
        });
      }
    }

    const teamsData = teams.map((team) => ({ draft: data.id, users: team }));

    async function generateTeam(team: { draft: number; users: number[] }) {
      return strapi.db?.query("plugin::team-builder.team-draft").create({
        data: team,
      });
    }

    const result = await Promise.all(
      teamsData.map((team) => generateTeam(team))
    );

    return updateDraftResponse;
  },

  async deleteDraft(id: number) {
    const findDraftTeamsResponse = await strapi.db
      ?.query("plugin::team-builder.team-draft")
      .findMany({
        where: {
          draft: {
            id: id,
          },
        },
      });

    if (findDraftTeamsResponse) {
      for (const teamDraft of findDraftTeamsResponse) {
        strapi.db?.query("plugin::team-builder.team-draft").delete({
          where: {
            id: teamDraft.id,
          },
        });
      }
    }

    const deleteDraftResponse = await strapi.entityService?.delete(
      "plugin::team-builder.draft",
      id
    );

    return deleteDraftResponse;
  },
});
