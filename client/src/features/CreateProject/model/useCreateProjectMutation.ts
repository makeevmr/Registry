"use client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createProject } from "../api/createProject";
import { CreateProjectData } from "../types/types";

export const useCreateProjectMutation = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: CreateProjectData) => {
      return Promise.resolve(createProject(data));
    },
    onSuccess: (result) => {
      router.push("/projects/" + result.slug);
    },
  });
};
