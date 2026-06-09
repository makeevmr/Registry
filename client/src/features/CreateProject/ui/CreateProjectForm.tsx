"use client";
import { ProjectForm } from "@/entities/Project";
import { fetchAllTags } from "@/entities/Tag";
import { useQuery } from "@tanstack/react-query";
import { FC } from "react";
import { useCreateProjectMutation } from "../model/useCreateProjectMutation";

const CreateProjectForm: FC = () => {
  const { data: tagOptions = [] } = useQuery({
    queryKey: ["all-tags"],
    queryFn: fetchAllTags,
  });

  const mutation = useCreateProjectMutation();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Создать проект</h1>
      <ProjectForm
        mode="create"
        tagOptions={tagOptions}
        submitLabel="Создать"
        loadingLabel="Создание..."
        isLoading={mutation.isLoading}
        serverError={
          mutation.error instanceof Error ? mutation.error.message : undefined
        }
        onSubmit={(values) => mutation.mutate(values)}
      />
    </div>
  );
};

export default CreateProjectForm;
