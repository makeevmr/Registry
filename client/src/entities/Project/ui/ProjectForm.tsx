"use client";
import {
  Button,
  CalendarInput,
  FormInput,
  MultiselectDropdown,
} from "@/shared/ui";
import { FC, useState } from "react";

const SHORT_NAME_REGEX = /^[A-Za-z ]+$/;

// Local Y-M-D to avoid the UTC day-shift that toISOString() can cause.
const toISODate = (date: Date | null) => {
  if (!date) return "";
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

export interface ProjectFormInitialValues {
  name: string;
  description: string;
  dateStart: string | null;
  dateEnd: string | null;
  enrollmentStart: string | null;
  enrollmentEnd: string | null;
  client: string;
  clientContact: string;
  teamLimit: number | null;
  tags: string[];
  developerRequirements: string[];
  projectRequirements: string[];
}

export interface ProjectFormSubmitValues {
  name: string;
  // Empty in edit mode (slug is immutable, so short name isn't editable).
  shortName: string;
  description: string;
  dateStart: string;
  dateEnd: string;
  enrollmentStart: string;
  enrollmentEnd: string;
  client: string;
  clientContact: string;
  teamLimit: number;
  tags: string[];
  developerRequirements: string[];
  projectRequirements: string[];
}

interface ProjectFormProps {
  mode: "create" | "edit";
  tagOptions: string[];
  initial?: Partial<ProjectFormInitialValues>;
  submitLabel: string;
  loadingLabel: string;
  isLoading: boolean;
  serverError?: string;
  onSubmit: (values: ProjectFormSubmitValues) => void;
}

// Editable list of free-text requirement lines.
const RequirementsEditor: FC<{
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder: string;
}> = ({ label, items, onChange, placeholder }) => {
  const update = (index: number, value: string) =>
    onChange(items.map((item, i) => (i === index ? value : item)));
  const remove = (index: number) =>
    onChange(items.filter((_, i) => i !== index));

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs text-[#898989]">{label}</span>
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <FormInput
            className="grow"
            placeholder={placeholder}
            value={item}
            onChange={(value) => update(index, value)}
          />
          <button
            type="button"
            className="cursor-pointer px-2 text-primary"
            onClick={() => remove(index)}
          >
            ✕
          </button>
        </div>
      ))}
      <button
        type="button"
        className="w-max cursor-pointer text-sm text-[#898989] underline"
        onClick={() => onChange([...items, ""])}
      >
        + Добавить
      </button>
    </div>
  );
};

const ProjectForm: FC<ProjectFormProps> = ({
  mode,
  tagOptions,
  initial,
  submitLabel,
  loadingLabel,
  isLoading,
  serverError,
  onSubmit,
}) => {
  const [name, setName] = useState(initial?.name ?? "");
  const [shortName, setShortName] = useState("");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [client, setClient] = useState(initial?.client ?? "");
  const [clientContact, setClientContact] = useState(
    initial?.clientContact ?? "",
  );
  const [teamLimit, setTeamLimit] = useState(
    initial?.teamLimit != null ? String(initial.teamLimit) : "",
  );

  const [dateStart, setDateStart] = useState<Date | null>(
    initial?.dateStart ? new Date(initial.dateStart) : null,
  );
  const [dateEnd, setDateEnd] = useState<Date | null>(
    initial?.dateEnd ? new Date(initial.dateEnd) : null,
  );
  const [enrollmentStart, setEnrollmentStart] = useState<Date | null>(
    initial?.enrollmentStart ? new Date(initial.enrollmentStart) : null,
  );
  const [enrollmentEnd, setEnrollmentEnd] = useState<Date | null>(
    initial?.enrollmentEnd ? new Date(initial.enrollmentEnd) : null,
  );

  const [tags, setTags] = useState<string[]>(initial?.tags ?? []);
  const [developerRequirements, setDeveloperRequirements] = useState<string[]>(
    initial?.developerRequirements ?? [],
  );
  const [projectRequirements, setProjectRequirements] = useState<string[]>(
    initial?.projectRequirements ?? [],
  );

  const [error, setError] = useState("");

  const handleSubmit = () => {
    setError("");

    const trimmedShortName = shortName.trim();

    if (
      !name.trim() ||
      !description.trim() ||
      !client.trim() ||
      !clientContact.trim() ||
      (mode === "create" && !trimmedShortName)
    ) {
      setError("Заполните все поля");
      return;
    }

    if (mode === "create" && !SHORT_NAME_REGEX.test(trimmedShortName)) {
      setError(
        "Короткое название должно содержать только латинские буквы (A-Z, a-z) и пробелы",
      );
      return;
    }

    if (!dateStart || !dateEnd || !enrollmentStart || !enrollmentEnd) {
      setError("Укажите даты проекта и набора");
      return;
    }

    if (!tags.length) {
      setError("Выберите хотя бы один тег");
      return;
    }

    const teamLimitNum = Number(teamLimit);
    if (!Number.isInteger(teamLimitNum) || teamLimitNum < 1) {
      setError("Количество команд должно быть целым числом больше 0");
      return;
    }

    onSubmit({
      name: name.trim(),
      shortName: trimmedShortName,
      description: description.trim(),
      dateStart: toISODate(dateStart),
      dateEnd: toISODate(dateEnd),
      enrollmentStart: toISODate(enrollmentStart),
      enrollmentEnd: toISODate(enrollmentEnd),
      client: client.trim(),
      clientContact: clientContact.trim(),
      teamLimit: teamLimitNum,
      tags,
      developerRequirements: developerRequirements
        .map((req) => req.trim())
        .filter(Boolean),
      projectRequirements: projectRequirements
        .map((req) => req.trim())
        .filter(Boolean),
    });
  };

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <FormInput
        id="project-name"
        label="Название проекта"
        placeholder="Проект 1"
        value={name}
        onChange={setName}
      />

      {mode === "create" && (
        <FormInput
          id="project-short-name"
          label="Короткое название (латиницей, для ссылки)"
          placeholder="Simple test project name"
          value={shortName}
          onChange={setShortName}
        />
      )}

      <div className="flex flex-col">
        <label
          className="pb-1 text-xs text-[#898989]"
          htmlFor="project-description"
        >
          Описание
        </label>
        <textarea
          id="project-description"
          className="min-h-[7rem] resize-y border-b border-[#898989] bg-transparent pb-2 font-normal outline-none"
          placeholder="Описание проекта"
          value={description}
          rows={5}
          onChange={(e) => {
            setDescription(e.target.value);
            // Auto-grow so the whole text stays visible.
            e.target.style.height = "auto";
            e.target.style.height = e.target.scrollHeight + "px";
          }}
        />
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-xs text-[#898989]">Сроки проекта</span>
        <CalendarInput
          placeholder="Начало и конец проекта"
          start={initial?.dateStart ?? undefined}
          end={initial?.dateEnd ?? undefined}
          onChange={(start, end) => {
            setDateStart(start);
            setDateEnd(end);
          }}
        />
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-xs text-[#898989]">Сроки набора</span>
        <CalendarInput
          placeholder="Начало и конец набора"
          start={initial?.enrollmentStart ?? undefined}
          end={initial?.enrollmentEnd ?? undefined}
          onChange={(start, end) => {
            setEnrollmentStart(start);
            setEnrollmentEnd(end);
          }}
        />
      </div>

      <FormInput
        id="project-client"
        label="Заказчик"
        placeholder="ООО Компания"
        value={client}
        onChange={setClient}
      />

      <FormInput
        id="project-client-contact"
        label="Контакт заказчика"
        placeholder="tg: @username"
        value={clientContact}
        onChange={setClientContact}
      />

      <FormInput
        id="project-team-limit"
        label="Количество команд"
        placeholder="3"
        value={teamLimit}
        onChange={(value) => setTeamLimit(value.replace(/[^0-9]/g, ""))}
      />

      <RequirementsEditor
        label="Требования проекта"
        items={projectRequirements}
        onChange={setProjectRequirements}
        placeholder="Требование к проекту"
      />

      <RequirementsEditor
        label="Требования для исполнителей"
        items={developerRequirements}
        onChange={setDeveloperRequirements}
        placeholder="Требование к исполнителю"
      />

      <div className="flex flex-col gap-1">
        <span className="text-xs text-[#898989]">Теги</span>
        {/* key remounts the dropdown once tags load / prefill changes, so
            useMultiselect picks up options (it only reads them on mount). */}
        <MultiselectDropdown
          key={`tags-${tagOptions.length}`}
          placeholder="Выберите теги"
          items={tags}
          options={tagOptions}
          onChange={setTags}
        />
      </div>

      {(error || serverError) && (
        <p className="text-primary">{error || serverError}</p>
      )}

      <Button type="button" onClick={handleSubmit} className="w-max">
        {isLoading ? loadingLabel : submitLabel}
      </Button>
    </div>
  );
};

export default ProjectForm;
