import { authorizedFetch } from "@/shared/utils";
import { SurveyData } from "../types/types";

export const submitSurvey = async (data: SurveyData) => {
  const response = await authorizedFetch("/api/survey", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to submit survey");
  }

  return response.json();
};
