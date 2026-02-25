import { strapi } from "@/db/strapi/client";
import { ServerError } from "@/helpers/errors";
import uploadRepository from "../upload";

interface SurveyResult {
  file: number | null;
  date: string;
}

const surveyResultRepositoryFactory = () => {
  return Object.freeze({
    findByUser,
    submit,
  });

  async function findByUser(userId: number): Promise<SurveyResult | null> {
    const params = {
      populate: {
        survey: {
          populate: {
            file: {
              fields: ["id", "url"],
            },
          },
        },
      },
    };

    const response = await strapi.get("students/" + userId, {
      token: process.env.USER_TOKEN!,
      params,
    });

    if (!response || !response.data || !response.data.attributes.survey) {
      return null;
    }

    const survey = response.data.attributes.survey;
    return {
      file: survey.file?.data?.id || null,
      date: survey.date,
    };
  }

  async function submit(surveyData: any, userId: number) {
    // Upload survey data as JSON file
    const fileUploadResponse = await uploadRepository.upload({
      data: JSON.stringify(surveyData, null, 2),
      name: `survey-${userId}-${new Date().toISOString()}.json`,
    });

    const surveyResult = {
      date: new Date().toISOString(),
      file: fileUploadResponse[0] ? fileUploadResponse[0].id : null,
    };

    const body = {
      data: {
        survey: surveyResult,
      },
    };

    const createResponse = await strapi.put("students/" + userId, {
      token: process.env.USER_TOKEN!,
      body,
    });

    if (!createResponse) throw new ServerError("Couldn't submit survey");

    return surveyResult;
  }
};

const surveyResultRepository = surveyResultRepositoryFactory();

export default surveyResultRepository;
