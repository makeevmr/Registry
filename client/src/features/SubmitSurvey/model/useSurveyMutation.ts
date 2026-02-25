import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitSurvey } from "../api/submitSurvey";
import { SurveyData } from "../types/types";

export const useSurveyMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SurveyData) => submitSurvey(data),
    onSuccess: () => {
      // Invalidate profile query to refresh survey status
      queryClient.invalidateQueries({ queryKey: ["profile"] });

      // Show success notification
      alert("Анкета успешно отправлена!");
    },
    onError: (error: Error) => {
      // Show error notification
      alert(`Ошибка: ${error.message}`);
    },
  });
};
