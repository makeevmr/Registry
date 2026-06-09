import { authorizedFetch } from "@/shared/utils";
import { ProjectFormSubmitValues } from "@/entities/Project";

// shortName/slug are immutable on edit, so they're excluded from the payload.
export type UpdateProjectData = Omit<ProjectFormSubmitValues, "shortName">;

export const updateProject = async (
  slug: string,
  data: UpdateProjectData,
) => {
  const response = await authorizedFetch("/api/project/" + slug, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    let message = "Не удалось обновить проект";
    try {
      const error = await response.json();
      message = error.message || message;
    } catch {}
    throw new Error(message);
  }

  return response.json();
};
