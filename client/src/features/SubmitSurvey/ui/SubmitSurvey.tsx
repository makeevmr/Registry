"use client";
import { Button, LoadingCircle, Block } from "@/shared/ui";
import { FC, useState } from "react";
import { useSurveyMutation } from "../model/useSurveyMutation";
import {
  Chapter1Data,
  Chapter2Data,
  Chapter3Data,
  Chapter4Data,
  Chapter5Data,
  SurveyData,
} from "../types/types";
import Chapter1 from "./Chapter1";
import Chapter2 from "./Chapter2";
import Chapter3 from "./Chapter3";
import Chapter4 from "./Chapter4";
import Chapter5 from "./Chapter5";

interface SubmitSurveyProps {
  isCompleted?: boolean;
}

const SubmitSurvey: FC<SubmitSurveyProps> = ({ isCompleted = false }) => {
  const [currentChapter, setCurrentChapter] = useState(1);
  const [surveyData, setSurveyData] = useState<SurveyData>({
    chapter1: {
      developmentWishes: "",
      roleInterests: {
        "Бизнес и системный анализ": "",
        "Дизайн UX / UI и проектирование интерфейсов": "",
        "Анализ и инженерия данных": "",
        "Backend - разработка": "",
        "Frontend - разработка": "",
        "Тестирование и обеспечение качества": "",
        "Развертывание и внедрение": "",
        "Управление командой / проектом": "",
      },
      directionInterests: {
        "Разработка веб-сервисов (сайты, сервисы)": "",
        "Анализ текстов и поисковые движки": "",
        "Анализ изображений / видео": "",
        "Анализ временных рядов": "",
        "Анализ табличных данных": "",
        "Робототехника (оборудование, теория управления, техническое зрение, интерфейсы)": "",
        "Gamedev": "",
      },
      otherDirection: "",
      currentProject: "",
    },
    chapter2: {
      knowledge: "",
      itKnowledge: {
        "Парадигмы программирования (ООП, функциональное, аспектно-ориентированное, и др.)": "",
        "Архитектура ПО": "",
        "Паттерны проектирования": "",
        "Протоколы коммуникаций (REST, gRPC, и др.)": "",
        "Алгоритмы и структуры данных": "",
        "Потоки и параллельность": "",
        "Linux в разработке и администрировании": "",
        "Windows в разработке и администрировании": "",
        "Проектирование и оптимизация баз данных": "",
        "Наука о данных и машинное обучение": "",
      },
      otherKnowledge: "",
    },
    chapter3: {
      programmingLanguages: "",
      librariesFrameworks: "",
      designTools: "",
      developmentTools: "",
      testingTools: "",
      cicdTools: "",
      projectManagementTools: "",
    },
    chapter4: {
      skills: "",
      analyticalSkills: {
        "Поиск информации (научные статьи, документация)": "",
        "Сбор и анализ требований к ПО": "",
        "Декомпозиция задач": "",
        "Планирование своей и чужой деятельности": "",
        "Тестирование": "",
        "Ведение документации": "",
      },
      softSkills: {
        "Самоуправление": "",
        "Коммуникации": "",
        "Работа в команде": "",
        "Наставничество": "",
        "Управление людьми": "",
      },
      otherSkills: "",
    },
    chapter5: {
      motivation: "",
      motivationLevels: {
        "К работе над интересными проектами": "",
        "Определить свой путь дальнейшего развития и развиваться в IT": "",
        "Устроиться на интересную для себя работу": "",
      },
      wantToCommunicate: "",
      developmentHelp: "",
    },
  });

  const { mutate, isLoading } = useSurveyMutation();

  // Validation for Chapter 1
  // Helper function to validate tool format
  const validateToolFormat = (text: string): boolean => {
    if (!text.trim()) return true; // Empty is OK (optional fields)

    const lines = text.trim().split("\n");
    const toolRegex = /^[A-ZА-ЯЁ][^\-]+ - [1-5]$/;

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (trimmedLine && !toolRegex.test(trimmedLine)) {
        return false;
      }
    }
    return true;
  };

  // Validation for Chapter 5
  const validateChapter5 = (): boolean => {
    const { motivationLevels, wantToCommunicate } = surveyData.chapter5;

    // Check if ALL motivation areas are rated (required)
    const unfilledMotivation = Object.entries(motivationLevels).filter(
      ([_, value]) => value === ""
    );
    if (unfilledMotivation.length > 0) {
      alert(
        `Пожалуйста, оцените все области мотивации. Не заполнено: ${unfilledMotivation.length} ${
          unfilledMotivation.length === 1 ? "область" : "областей"
        }`
      );
      return false;
    }

    // Check if communication preference is selected (required)
    if (!wantToCommunicate) {
      alert("Пожалуйста, ответьте на вопрос о желании общаться с другими студентами");
      return false;
    }

    return true;
  };

  // Validation for Chapter 4
  const validateChapter4 = (): boolean => {
    const { analyticalSkills, softSkills } = surveyData.chapter4;

    // Check if ALL analytical skills are rated (required)
    const unfilledAnalytical = Object.entries(analyticalSkills).filter(
      ([_, value]) => value === ""
    );
    if (unfilledAnalytical.length > 0) {
      alert(
        `Пожалуйста, оцените все аналитические навыки. Не заполнено: ${unfilledAnalytical.length} ${
          unfilledAnalytical.length === 1 ? "навык" : "навыков"
        }`
      );
      return false;
    }

    // Check if ALL soft skills are rated (required)
    const unfilledSoft = Object.entries(softSkills).filter(
      ([_, value]) => value === ""
    );
    if (unfilledSoft.length > 0) {
      alert(
        `Пожалуйста, оцените все soft skills. Не заполнено: ${unfilledSoft.length} ${
          unfilledSoft.length === 1 ? "навык" : "навыков"
        }`
      );
      return false;
    }

    return true;
  };

  // Validation for Chapter 3
  const validateChapter3 = (): boolean => {
    const fields = [
      { name: "Языки программирования", value: surveyData.chapter3.programmingLanguages },
      { name: "Библиотеки и фреймворки", value: surveyData.chapter3.librariesFrameworks },
      { name: "Инструменты проектирования", value: surveyData.chapter3.designTools },
      { name: "Инструменты разработки", value: surveyData.chapter3.developmentTools },
      { name: "Инструменты тестирования", value: surveyData.chapter3.testingTools },
      { name: "Инструменты CI/CD", value: surveyData.chapter3.cicdTools },
      { name: "Инструменты управления проектами", value: surveyData.chapter3.projectManagementTools },
    ];

    for (const field of fields) {
      if (!validateToolFormat(field.value)) {
        alert(
          `Неверный формат в поле "${field.name}". Используйте формат: "Инструмент - Оценка" (например: "Python - 3")`
        );
        return false;
      }
    }

    return true;
  };

  // Validation for Chapter 2
  const validateChapter2 = (): boolean => {
    const { itKnowledge } = surveyData.chapter2;

    // Check if ALL IT knowledge areas are rated (required)
    const unfilledSkills = Object.entries(itKnowledge).filter(
      ([_, value]) => value === ""
    );
    if (unfilledSkills.length > 0) {
      alert(
        `Пожалуйста, оцените все области знаний. Не заполнено: ${unfilledSkills.length} ${
          unfilledSkills.length === 1 ? "область" : "областей"
        }`
      );
      return false;
    }

    return true;
  };

  const validateChapter1 = (): boolean => {
    const { roleInterests, directionInterests } = surveyData.chapter1;

    // Check if ALL roles are selected (required)
    const unfilledRoles = Object.entries(roleInterests).filter(
      ([_, value]) => value === ""
    );
    if (unfilledRoles.length > 0) {
      alert(
        `Пожалуйста, выберите вариант для всех ролей. Не заполнено: ${unfilledRoles.length} ${
          unfilledRoles.length === 1 ? "роль" : "ролей"
        }`
      );
      return false;
    }

    // Check if ALL directions are selected (required)
    const unfilledDirections = Object.entries(directionInterests).filter(
      ([_, value]) => value === ""
    );
    if (unfilledDirections.length > 0) {
      alert(
        `Пожалуйста, выберите вариант для всех направлений. Не заполнено: ${unfilledDirections.length} ${
          unfilledDirections.length === 1 ? "направление" : "направлений"
        }`
      );
      return false;
    }

    return true;
  };

  const handleNextChapter = () => {
    if (currentChapter === 1 && !validateChapter1()) {
      return;
    }
    if (currentChapter === 2 && !validateChapter2()) {
      return;
    }
    if (currentChapter === 3 && !validateChapter3()) {
      return;
    }
    if (currentChapter === 4 && !validateChapter4()) {
      return;
    }
    if (currentChapter === 5 && !validateChapter5()) {
      return;
    }

    if (currentChapter < 5) {
      setCurrentChapter(currentChapter + 1);
    }
  };

  const handlePrevChapter = () => {
    if (currentChapter > 1) {
      setCurrentChapter(currentChapter - 1);
    }
  };

  const handleSubmit = () => {
    // Validate all chapters before submission
    if (!validateChapter1()) {
      setCurrentChapter(1);
      return;
    }
    if (!validateChapter2()) {
      setCurrentChapter(2);
      return;
    }
    if (!validateChapter3()) {
      setCurrentChapter(3);
      return;
    }
    if (!validateChapter4()) {
      setCurrentChapter(4);
      return;
    }
    if (!validateChapter5()) {
      setCurrentChapter(5);
      return;
    }

    mutate(surveyData);
  };

  const updateChapter1 = (data: Partial<Chapter1Data>) => {
    setSurveyData((prev) => ({
      ...prev,
      chapter1: { ...prev.chapter1, ...data },
    }));
  };

  const updateChapter2 = (data: Partial<Chapter2Data>) => {
    setSurveyData((prev) => ({
      ...prev,
      chapter2: { ...prev.chapter2, ...data },
    }));
  };

  const updateChapter3 = (data: Partial<Chapter3Data>) => {
    setSurveyData((prev) => ({
      ...prev,
      chapter3: { ...prev.chapter3, ...data },
    }));
  };

  const updateChapter4 = (data: Partial<Chapter4Data>) => {
    setSurveyData((prev) => ({
      ...prev,
      chapter4: { ...prev.chapter4, ...data },
    }));
  };

  const updateChapter5 = (data: Partial<Chapter5Data>) => {
    setSurveyData((prev) => ({
      ...prev,
      chapter5: { ...prev.chapter5, ...data },
    }));
  };

  if (isCompleted) {
    return (
      <Block className="rounded-xl px-11 py-10">
        <div className="flex items-center gap-4">
          <div className="text-xl font-semibold">
            Анкета уже заполнена
          </div>
        </div>
        <p className="pt-4 text-[#898989]">
          Вы уже прошли анкету. Повторное прохождение невозможно.
        </p>
      </Block>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <LoadingCircle />
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white px-11 py-10 shadow-md">
      <div className="mb-8">
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((chapter) => (
            <div
              key={chapter}
              className={`h-2 flex-1 rounded ${
                chapter === currentChapter
                  ? "bg-blue-500"
                  : chapter < currentChapter
                  ? "bg-green-500"
                  : "bg-gray-300"
              }`}
            />
          ))}
        </div>
        <p className="mt-2 text-sm text-[#898989]">
          Глава {currentChapter} из 5
        </p>
      </div>

      {currentChapter === 1 && (
        <Chapter1 data={surveyData.chapter1} onChange={updateChapter1} />
      )}
      {currentChapter === 2 && (
        <Chapter2 data={surveyData.chapter2} onChange={updateChapter2} />
      )}
      {currentChapter === 3 && (
        <Chapter3 data={surveyData.chapter3} onChange={updateChapter3} />
      )}
      {currentChapter === 4 && (
        <Chapter4 data={surveyData.chapter4} onChange={updateChapter4} />
      )}
      {currentChapter === 5 && (
        <Chapter5 data={surveyData.chapter5} onChange={updateChapter5} />
      )}

      <div className="mt-8 flex justify-between">
        {currentChapter === 1 ? (
          <div className="px-8 py-3" />
        ) : (
          <Button className="px-8 py-3" onClick={handlePrevChapter}>
            Назад
          </Button>
        )}

        {currentChapter < 5 ? (
          <Button className="px-8 py-3" onClick={handleNextChapter}>
            Далее
          </Button>
        ) : (
          <Button className="px-8 py-3" onClick={handleSubmit}>
            Отправить
          </Button>
        )}
      </div>
    </div>
  );
};

export default SubmitSurvey;
