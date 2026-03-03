import React from "react";
import { useFormStore } from "../../Form/model";
import { useStudentStore } from "../../Student";
import { useDraftTeamsStore } from "../../Team/model";
import { useFetchClient } from "@strapi/helper-plugin";
import { useDraftStore } from "./useDraftStore";

export const useDraft = () => {
  const { selectedForm, setSelectedForm } = useFormStore();
  const { students, getSelectedStudents, setSelectedStudents, fetchBySurvey } =
    useStudentStore();
  const { teams, setTeams } = useDraftTeamsStore();
  const { draft, setDraft } = useDraftStore();

  const { get, post, put } = useFetchClient();

  // Check if draft is survey-based
  const isSurveyBased = draft?.survey ? true : false;

  const initialize = async (draftId: number | null) => {
    if (typeof draftId != "number") return;

    const response = await get("/team-builder/draft/" + draftId);

    if (response.status != 200) return;

    // Check if this draft has a survey field
    if (response.data?.survey) {
      // Survey-based draft
      fetchBySurvey();
    } else {
      // Form-based draft
      setSelectedForm(response.data?.form?.id || null);
    }

    setSelectedStudents(
      response?.data?.activeStudents?.map(
        (student: { id: number }) => student.id
      ) || null
    );
    setTeams(
      response.data.teams.map((team: { users: { id: number }[] }) => ({
        students: team.users.map((user) => user.id),
      }))
    );

    setDraft({
      id: response?.data?.id,
      name: response?.data?.name,
      survey: response?.data?.survey || null,
    });
  };

  const saveDraft = async () => {
    if (!draft) return;
    const response = await put("/team-builder/draft/" + draft.id, {
      draft: {
        id: draft.id,
        name: draft.name,
        form: isSurveyBased ? null : selectedForm,
        survey: isSurveyBased ? "Анкета ПМ-ПУ" : null,
        activeStudents: getSelectedStudents(),
        teams: teams.map((team) =>
          team.students
            .map((student) => students.find((mapped) => mapped.id == student))
            .filter((student) => student)
        ),
      },
    });
  };

  const generateDraft = async () => {
    const response = await post("/team-builder/generate", {
      teams: teams.map((team) => ({
        students: team.students
          .map((student) => students.find((mapped) => mapped.id == student))
          .filter((student) => student),
      })),
    });

    return response.status;
  };

  return { draft, setDraft, initialize, saveDraft, generateDraft, isSurveyBased };
};
