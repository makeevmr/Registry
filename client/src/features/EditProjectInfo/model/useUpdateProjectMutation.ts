"use client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { UpdateProjectData, updateProject } from "../api/updateProject";

export const useUpdateProjectMutation = (onDone?: () => void) => {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: { slug: string; values: UpdateProjectData }) => {
      return Promise.resolve(updateProject(data.slug, data.values));
    },
    onSuccess: () => {
      // Re-fetch the server component so the new data shows.
      router.refresh();
      onDone?.();
    },
  });
};
