import { authorizedFetch } from "@/shared/utils";
import { CreateProjectData } from "../types/types";

export const createProject = async (data: CreateProjectData) => {
  const response = await authorizedFetch("/api/project", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    let message = "Не удалось создать проект";
    try {
      const error = await response.json();
      message = error.message || message;
    } catch {}
    throw new Error(message);
  }

  return response.json() as Promise<{ id: number; slug: string }>;
};
