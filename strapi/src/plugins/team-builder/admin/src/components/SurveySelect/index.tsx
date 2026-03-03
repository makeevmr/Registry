import React, { FC, useEffect } from "react";
import { SingleSelect, SingleSelectOption } from "@strapi/design-system";
import { useStudentStore } from "../../entities/Student";

interface SurveySelectProps {}

const SurveySelect: FC<SurveySelectProps> = () => {
  const { fetchBySurvey: fetchStudentsBySurvey } = useStudentStore();

  const surveyName = "Анкета ПМ-ПУ";

  useEffect(() => {
    // Fetch students who passed the survey
    fetchStudentsBySurvey();
  }, []);

  return (
    <SingleSelect
      value={surveyName}
      onChange={() => {}}
      label="Survey"
      required
      placeholder="Select a survey"
      disabled
    >
      <SingleSelectOption value={surveyName}>
        {surveyName}
      </SingleSelectOption>
    </SingleSelect>
  );
};

export default SurveySelect;
