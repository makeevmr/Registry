import { Strapi } from "@strapi/strapi";
import fs from "fs/promises";
import path from "path";
import axios from "axios";

export default ({ strapi }: { strapi: Strapi }) => ({
  index(ctx: any) {
    ctx.body = "";
  },

  async generateTeams(ctx: any) {
    if (!ctx.request.body.teams) return (ctx.body = 0);

    ctx.body = await strapi
      .plugin("team-builder")
      .service("teamDraftService")
      .generateTeams(ctx.request.body.teams);
  },

  async autogenerate(ctx: any) {
    const { users, projects, isSurveyBased } = ctx.request.body;

    if (!users) return (ctx.body = 0);

    // Handle survey-based autogeneration
    if (isSurveyBased) {
      try {
        // Generate algorithm input JSON
        const inputData = await strapi
          .plugin("team-builder")
          .service("surveyAdapterService")
          .generateAlgorithmInput(users, projects || []);

        // Save to file for inspection
        const outputPath = path.join(
          process.cwd(),
          "algorithm-input.json"
        );
        await fs.writeFile(
          outputPath,
          JSON.stringify(inputData, null, 2),
          "utf-8"
        );

        console.log(`Algorithm input saved to: ${outputPath}`);

        // Make HTTP request to ML algorithm
        // Use Docker service name to access algorithm container
        const algorithmUrl = process.env.ALGORITHM_URL || "http://algorithm:8005/run_model/";
        console.log(`Calling algorithm at: ${algorithmUrl}`);

        const algorithmResponse = await axios.post(
          algorithmUrl,
          inputData,
          {
            headers: {
              "Content-Type": "application/json",
            },
            timeout: 120000, // 2 minutes timeout
          }
        );

        console.log("Algorithm response:", algorithmResponse.data);

        // Extract teams from algorithm output
        // Output format: { result: [{ project_id: "chat-bot", team_members_ids: [149, 100, ...] }] }
        const teams = algorithmResponse.data.result.map((team: any) => ({
          students: team.team_members_ids,
        }));

        ctx.body = teams;
      } catch (error: any) {
        console.error("Error in survey-based autogeneration:", error);
        ctx.status = 500;
        ctx.body = {
          error: error.message,
          details: error.response?.data || "No additional details"
        };
      }
    } else {
      // Original form-based autogeneration
      ctx.body = await strapi
        .plugin("team-builder")
        .service("autogenerateService")
        .autogenerate(users);
    }
  },
});
