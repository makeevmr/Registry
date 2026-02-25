// Chapter 1 types
export type RoleInterest = "Не интересно" | "Интересно, можно попробовать" | "Хочу поучаствовать в проекте в этой роли и развиваться дальше в этой области";
export type DirectionInterest = "Не интересно" | "Интересно, можно попробовать" | "Хочу поучаствовать в проекте по этому направлению";

export interface RoleInterests {
  "Бизнес и системный анализ": RoleInterest | "";
  "Дизайн UX / UI и проектирование интерфейсов": RoleInterest | "";
  "Анализ и инженерия данных": RoleInterest | "";
  "Backend - разработка": RoleInterest | "";
  "Frontend - разработка": RoleInterest | "";
  "Тестирование и обеспечение качества": RoleInterest | "";
  "Развертывание и внедрение": RoleInterest | "";
  "Управление командой / проектом": RoleInterest | "";
}

export interface DirectionInterests {
  "Разработка веб-сервисов (сайты, сервисы)": DirectionInterest | "";
  "Анализ текстов и поисковые движки": DirectionInterest | "";
  "Анализ изображений / видео": DirectionInterest | "";
  "Анализ временных рядов": DirectionInterest | "";
  "Анализ табличных данных": DirectionInterest | "";
  "Робототехника (оборудование, теория управления, техническое зрение, интерфейсы)": DirectionInterest | "";
  "Gamedev": DirectionInterest | "";
}

export interface Chapter1Data {
  developmentWishes: string; // Optional
  roleInterests: RoleInterests; // Required - at least one must be filled
  directionInterests: DirectionInterests; // Required - at least one must be filled
  otherDirection: string; // Optional
  currentProject: string; // Optional
}

// Chapter 2 types
export type KnowledgeLevel = "0" | "1" | "2" | "3" | "4" | "5";

export interface ITKnowledge {
  "Парадигмы программирования (ООП, функциональное, аспектно-ориентированное, и др.)": KnowledgeLevel | "";
  "Архитектура ПО": KnowledgeLevel | "";
  "Паттерны проектирования": KnowledgeLevel | "";
  "Протоколы коммуникаций (REST, gRPC, и др.)": KnowledgeLevel | "";
  "Алгоритмы и структуры данных": KnowledgeLevel | "";
  "Потоки и параллельность": KnowledgeLevel | "";
  "Linux в разработке и администрировании": KnowledgeLevel | "";
  "Windows в разработке и администрировании": KnowledgeLevel | "";
  "Проектирование и оптимизация баз данных": KnowledgeLevel | "";
  "Наука о данных и машинное обучение": KnowledgeLevel | "";
}

export interface Chapter2Data {
  knowledge: string; // Optional
  itKnowledge: ITKnowledge; // Required - all rows must be filled
  otherKnowledge: string; // Optional
}
// Chapter 3 types
export interface Chapter3Data {
  programmingLanguages: string; // Optional - format: "Tool - Rating\n"
  librariesFrameworks: string; // Optional - format: "Tool - Rating\n"
  designTools: string; // Optional - format: "Tool - Rating\n"
  developmentTools: string; // Optional - format: "Tool - Rating\n"
  testingTools: string; // Optional - format: "Tool - Rating\n"
  cicdTools: string; // Optional - format: "Tool - Rating\n"
  projectManagementTools: string; // Optional - format: "Tool - Rating\n"
}

// Chapter 4 types
export type AnalyticalSkillLevel = "0" | "1" | "2" | "3" | "4" | "5";
export type SoftSkillLevel = "Плохо" | "Ниже среднего" | "Нормально" | "Хорошо" | "Отлично";

export interface AnalyticalSkills {
  "Поиск информации (научные статьи, документация)": AnalyticalSkillLevel | "";
  "Сбор и анализ требований к ПО": AnalyticalSkillLevel | "";
  "Декомпозиция задач": AnalyticalSkillLevel | "";
  "Планирование своей и чужой деятельности": AnalyticalSkillLevel | "";
  "Тестирование": AnalyticalSkillLevel | "";
  "Ведение документации": AnalyticalSkillLevel | "";
}

export interface SoftSkills {
  "Самоуправление": SoftSkillLevel | "";
  "Коммуникации": SoftSkillLevel | "";
  "Работа в команде": SoftSkillLevel | "";
  "Наставничество": SoftSkillLevel | "";
  "Управление людьми": SoftSkillLevel | "";
}

export interface Chapter4Data {
  skills: string; // Optional
  analyticalSkills: AnalyticalSkills; // Required - all rows must be filled
  softSkills: SoftSkills; // Required - all rows must be filled
  otherSkills: string; // Optional
}
// Chapter 5 types
export type MotivationLevel = "0" | "1" | "2" | "3" | "4" | "5";
export type YesNo = "Да" | "Нет";

export interface MotivationLevels {
  "К работе над интересными проектами": MotivationLevel | "";
  "Определить свой путь дальнейшего развития и развиваться в IT": MotivationLevel | "";
  "Устроиться на интересную для себя работу": MotivationLevel | "";
}

export interface Chapter5Data {
  motivation: string; // Optional
  motivationLevels: MotivationLevels; // Required - all rows must be filled
  wantToCommunicate: YesNo | ""; // Required
  developmentHelp: string; // Optional
}

export interface SurveyData {
  chapter1: Chapter1Data;
  chapter2: Chapter2Data;
  chapter3: Chapter3Data;
  chapter4: Chapter4Data;
  chapter5: Chapter5Data;
}

export interface SurveyResponse {
  id: number;
  submittedAt: string;
  message: string;
}
