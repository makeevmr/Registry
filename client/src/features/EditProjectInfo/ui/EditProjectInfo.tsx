"use client";
import { IProjectSingle, ProjectForm } from "@/entities/Project";
import { ITag, fetchAllTags, getTagsByTagIds } from "@/entities/Tag";
import { useAuthQuery } from "@/entities/User";
import { Button } from "@/shared/ui";
import { useQuery } from "@tanstack/react-query";
import { FC, useState } from "react";
import { useUpdateProjectMutation } from "../model/useUpdateProjectMutation";

interface EditProjectInfoProps {
  slug: string;
  project: IProjectSingle;
  // The project's tags (with names), used to prefill the tags field.
  tags: ITag[];
}

const toISODate = (date: Date | null) => {
  if (!date) return null;
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const EditProjectInfo: FC<EditProjectInfoProps> = ({ slug, project, tags }) => {
  const { data: user } = useAuthQuery();

  const [editing, setEditing] = useState(false);

  const { data: tagOptions = [] } = useQuery({
    queryKey: ["all-tags"],
    queryFn: fetchAllTags,
    enabled: editing,
  });

  const mutation = useUpdateProjectMutation(() => setEditing(false));

  // Only the owning employer may edit.
  if (user?.userType !== "employer" || user.id !== project.employerOwner)
    return null;

  if (!editing) {
    return (
      <div className="pt-10">
        <Button className="w-max px-9" onClick={() => setEditing(true)}>
          Редактировать
        </Button>
      </div>
    );
  }

  // Prefill with the project's current values (state at the last "create"/save).
  const tagNames = getTagsByTagIds(project.tags, tags)
    .filter(Boolean)
    .map((tag) => tag.name);

  return (
    <div className="flex flex-col gap-4 pt-10">
      <h2 className="text-2xl font-bold">Редактировать проект</h2>
      <ProjectForm
        mode="edit"
        tagOptions={tagOptions}
        initial={{
          name: project.name,
          description: project.description,
          dateStart: toISODate(project.dateStart),
          dateEnd: toISODate(project.dateEnd),
          enrollmentStart: toISODate(project.enrollmentStart),
          enrollmentEnd: toISODate(project.enrollmentEnd),
          client: project.client,
          clientContact: project.clientContact,
          teamLimit: project.teamLimit,
          tags: tagNames,
          developerRequirements: project.developerRequirements,
          projectRequirements: project.projectRequirements,
        }}
        submitLabel="Сохранить"
        loadingLabel="Сохранение..."
        isLoading={mutation.isLoading}
        serverError={
          mutation.error instanceof Error ? mutation.error.message : undefined
        }
        onSubmit={({ shortName, ...values }) =>
          mutation.mutate({ slug, values })
        }
      />
      <button
        type="button"
        className="w-max cursor-pointer px-4 text-[#898989] underline"
        onClick={() => setEditing(false)}
      >
        Отмена
      </button>
    </div>
  );
};

export default EditProjectInfo;
