import { User } from "@/entities/user";
import surveyResultRepository from "@/repositories/survey-result";

const surveyResultServiceFactory = () => {
  return Object.freeze({ submit, findByUser });

  async function submit(surveyData: any, user: User) {
    // Check if user already has a survey (one-time only)
    const existingSurvey = await surveyResultRepository.findByUser(user.id);

    if (existingSurvey) {
      throw new Error("Survey already completed. Cannot submit again.");
    }

    // Submit survey data
    return surveyResultRepository.submit(surveyData, user.id);
  }

  async function findByUser(userId: number) {
    return surveyResultRepository.findByUser(userId);
  }
};

const surveyResultService = surveyResultServiceFactory();

export default surveyResultService;
