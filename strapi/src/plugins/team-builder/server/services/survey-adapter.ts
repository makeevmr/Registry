import { Strapi } from "@strapi/strapi";
import fs from "fs/promises";
import path from "path";
import algorithmConfig from "../config/algorithm-config.json";

interface SurveyData {
  chapter1: {
    roleInterests: Record<string, string>;
    directionInterests: Record<string, string>;
    otherDirection: string;
    currentProject: string;
  };
  chapter2: {
    itKnowledge: Record<string, string>;
    otherKnowledge: string;
  };
  chapter3: {
    programmingLanguages: string;
    librariesFrameworks: string;
    designTools: string;
    developmentTools: string;
    testingTools: string;
    cicdTools: string;
    projectManagementTools: string;
  };
  chapter4: {
    analyticalSkills: Record<string, string>;
    softSkills: Record<string, string>;
    otherSkills: string;
  };
  chapter5: {
    motivationLevels: Record<string, string>;
    wantToCommunicate: string;
    developmentHelp: string;
  };
}

export default ({ strapi }: { strapi: Strapi }) => ({
  async convertSurveyToAlgorithmFormat(
    studentId: number,
    studentName: string,
    surveyData: SurveyData,
    surveyDate: string
  ) {
    // Define role interests rows in order
    const roleInterestsRows = [
      "Бизнес и системный анализ",
      "Дизайн UX / UI и проектирование интерфейсов",
      "Анализ и инженерия данных",
      "Backend - разработка",
      "Frontend - разработка",
      "Тестирование и обеспечение качества",
      "Развертывание и внедрение",
      "Управление командой / проектом",
    ];

    // Define direction interests rows in order
    const directionInterestsRows = [
      "Разработка веб-сервисов (сайты, сервисы)",
      "Анализ текстов и поисковые движки",
      "Анализ изображений / видео",
      "Анализ временных рядов",
      "Анализ табличных данных",
      "Робототехника (оборудование, теория управления, техническое зрение, интерфейсы)",
      "Gamedev",
    ];

    // Define IT knowledge rows in order
    const itKnowledgeRows = [
      "Парадигмы программирования (ООП, функциональное, аспектно-ориентированное, и др.)",
      "Архитектура ПО",
      "Паттерны проектирования",
      "Протоколы коммуникаций (REST, gRPC, и др.)",
      "Алгоритмы и структуры данных",
      "Потоки и параллельность",
      "Linux в разработке и администрировании",
      "Windows в разработке и администрировании",
      "Проектирование и оптимизация баз данных",
      "Наука о данных и машинное обучение",
    ];

    // Define analytical skills rows in order
    const analyticalSkillsRows = [
      "Поиск информации (научные статьи, документация)",
      "Сбор и анализ требований к ПО",
      "Декомпозиция задач",
      "Планирование своей и чужой деятельности",
      "Тестирование",
      "Ведение документации",
    ];

    // Define soft skills rows in order
    const softSkillsRows = [
      "Самоуправление",
      "Коммуникации",
      "Работа в команде",
      "Наставничество",
      "Управление людьми",
    ];

    // Define motivation levels rows in order
    const motivationLevelsRows = [
      "К работе над интересными проектами",
      "Определить свой путь дальнейшего развития и развиваться в IT",
      "Устроиться на интересную для себя работу",
    ];

    // Extract contact info (empty strings as placeholders)
    const githubLogin = "";
    const vkId = "";
    const telegramId = "";

    return {
      id: studentId,
      name: studentName,
      form: {
        formId: 1, // Survey ID
        data: [
          {
            type: "DEFAULT",
            question: "Timestamp",
            answer: surveyDate,
          },
          {
            type: "DEFAULT",
            question: "Фамилия Имя Отчество",
            answer: studentName,
          },
          {
            type: "DEFAULT",
            question: "Логин Github",
            answer: githubLogin,
          },
          {
            type: "DEFAULT",
            question:
              "Контактная информация для оперативной обратной связи в https://vk.com/id0",
            answer: vkId,
          },
          {
            type: "DEFAULT",
            question:
              "Контактная информация для оперативной обратной связи в telegram: @login",
            answer: telegramId,
          },
          {
            type: "GRID",
            question: "Выберете интересующие Вас роли, в  IT ",
            answers: roleInterestsRows.map(
              (row) => surveyData.chapter1.roleInterests[row]
            ),
            rows: roleInterestsRows,
          },
          {
            type: "GRID",
            question:
              "Выберете интересные для вас направление проекта (в направлении проекта могут быть все роли, указанные выше) ",
            answers: directionInterestsRows.map(
              (row) => surveyData.chapter1.directionInterests[row]
            ),
            rows: directionInterestsRows,
          },
          {
            type: "DEFAULT",
            question:
              "Если в предыдущем вопросе для Вас не было интересного направления деятельности, расскажите нам об области, в которой Вы хотите развиваться",
            answer: surveyData.chapter1.otherDirection,
          },
          {
            type: "DEFAULT",
            question:
              "Если Вы уже работаете над интересным проектом или успешно завершили - опишите, что это за проект и свою роль в нем (можете добавить ссылку на репозиторий)",
            answer: surveyData.chapter1.currentProject,
          },
          {
            type: "GRID",
            question: "Оцените Ваши знания в области IT ",
            answers: itKnowledgeRows.map(
              (row) =>
                `${surveyData.chapter2.itKnowledge[row]} - ${this.getItKnowledgeLabel(surveyData.chapter2.itKnowledge[row])}`
            ),
            rows: itKnowledgeRows,
          },
          {
            type: "DEFAULT",
            question:
              "Какими еще знаниями Вы владеете, релевантными для IT-отрасли и в какой степени? Перечислите их и оцените",
            answer: surveyData.chapter2.otherKnowledge,
          },
          {
            type: "DEFAULT",
            question:
              "Языки программирования (например: C++, Python, Java, etc)",
            answer: surveyData.chapter3.programmingLanguages,
          },
          {
            type: "DEFAULT",
            question:
              "Библиотеки и фреймворки для различных направлений использования (например: Qt, Numpy, Weka, Angular, PyTorch, etc)",
            answer: surveyData.chapter3.librariesFrameworks,
          },
          {
            type: "DEFAULT",
            question:
              "Инструменты для проектирования, бизнес и системного анализа (например: BPMN, UML, Archimate, ARIS etc)",
            answer: surveyData.chapter3.designTools,
          },
          {
            type: "DEFAULT",
            question:
              "Инструменты для разработки ПО - например: VS Code, PyCharm, Git, etc)",
            answer: surveyData.chapter3.developmentTools,
          },
          {
            type: "DEFAULT",
            question:
              "Инструменты для тестирования  (например: GTests, Selenium, Gatling, pytest etc)",
            answer: surveyData.chapter3.testingTools,
          },
          {
            type: "DEFAULT",
            question:
              "Инструменты CI / CD (например: Jenkins, Travis CI, Docker, etc)",
            answer: surveyData.chapter3.cicdTools,
          },
          {
            type: "DEFAULT",
            question:
              "Инструменты для управления проектами (например: Jira, Trello, MS Project, etc)",
            answer: surveyData.chapter3.projectManagementTools,
          },
          {
            type: "GRID",
            question: "Аналитические навыки ",
            answers: analyticalSkillsRows.map(
              (row) =>
                `${surveyData.chapter4.analyticalSkills[row]} - ${this.getAnalyticalSkillLabel(surveyData.chapter4.analyticalSkills[row])}`
            ),
            rows: analyticalSkillsRows,
          },
          {
            type: "GRID",
            question: "SoftSkills ",
            answers: softSkillsRows.map(
              (row) => surveyData.chapter4.softSkills[row]
            ),
            rows: softSkillsRows,
          },
          {
            type: "DEFAULT",
            question:
              "Какими еще навыками в области IT Вы обладаете? Оцените данные навыки",
            answer: surveyData.chapter4.otherSkills,
          },
          {
            type: "GRID",
            question: "Оцените Ваш уровень мотивации ",
            answers: motivationLevelsRows.map(
              (row) =>
                `${surveyData.chapter5.motivationLevels[row]} - ${this.getMotivationLabel(surveyData.chapter5.motivationLevels[row])}`
            ),
            rows: motivationLevelsRows,
          },
          {
            type: "DEFAULT",
            question:
              "Хотите ли Вы общаться с другими студентами и выпускниками, заинтересованными в развитии в области IT на базе СПбГУ на интересующие Вас темы?",
            answer: surveyData.chapter5.wantToCommunicate,
          },
          {
            type: "DEFAULT",
            question:
              "Что Вам поможет развиваться быстрее в том направлении деятельности, которое Вы выбрали?",
            answer: surveyData.chapter5.developmentHelp,
          },
        ],
      },
    };
  },

  getItKnowledgeLabel(level: string): string {
    const labels: Record<string, string> = {
      "0": "Не знаю",
      "1": "Что-то слышал или читал, но не овладел",
      "2": "Изучал информацию и частично разобрался",
      "3": "Применял в учебном проекте",
      "4": "Применял в проекте в команде",
      "5": "Применял в нескольких проектах и могу научить других",
    };
    return labels[level];
  },

  getAnalyticalSkillLabel(level: string): string {
    const labels: Record<string, string> = {
      "0": "Не знаю",
      "1": "Слышал, но не применял",
      "2": "Пробовал, и частично овладел",
      "3": "Искал доп информацию и пытался прокачаться",
      "4": "Применял в проекте",
      "5": "Применял в нескольких проектах",
    };
    return labels[level];
  },

  getMotivationLabel(level: string): string {
    const labels: Record<string, string> = {
      "1": "Не готов выполнять задания",
      "2": "Готов выполнять задания, если они простые",
      "3": "Готов выполнять задания, но если в них вижу личную выгоду/интерес",
      "4": "Готов выполнять задания на благо команды",
      "5": "Готов сам стать мотиватором для других",
    };
    return labels[level];
  },

  async generateAlgorithmInput(students: any[], projects: any[]) {
    const convertedUsers = [];

    console.log(`Processing ${students.length} students for algorithm input`);

    // Convert each student's survey data
    for (const student of students) {
      console.log(`Processing student ID: ${student.id}`);

      // Fetch student with survey data
      const studentData: any = await strapi.entityService?.findOne(
        "api::student.student",
        student.id,
        {
          populate: {
            surveyResult: {
              populate: {
                file: true,
              },
            },
          },
        }
      );

      console.log(`Prepare survey data for student ${student.id}`);

      if (!studentData) {
        console.warn(`Student ${student.id} not found`);
        continue;
      }

      if (!studentData.surveyResult) {
        console.warn(`No surveyResult for student ${student.id}`);
        continue;
      }

      if (!studentData.surveyResult.file) {
        console.warn(`No file in surveyResult for student ${student.id}`);
        continue;
      }

      // Read survey file from disk
      const surveyFileUrl = studentData.surveyResult.file.data?.attributes?.url || studentData.surveyResult.file.url;

      if (!surveyFileUrl) {
        console.warn(`No survey file URL for student ${student.id}`);
        continue;
      }

      const surveyFilePath = path.join(process.cwd(), "public", surveyFileUrl);
      console.log(`Reading survey file from: ${surveyFilePath}`);

      try {
        const surveyFileContent = await fs.readFile(surveyFilePath, "utf-8");
        const surveyData = JSON.parse(surveyFileContent);

        // Convert survey data to algorithm format
        const convertedUser = await this.convertSurveyToAlgorithmFormat(
          student.id,
          studentData.name as string,
          surveyData,
          studentData.surveyResult.date as string
        );

        convertedUsers.push(convertedUser);
        console.log(`Successfully converted student ${student.id}`);
      } catch (error) {
        console.error(`Error reading survey file for student ${student.id}:`, error);
        continue;
      }
    }

    console.log(`Converted ${convertedUsers.length} users`);

    // Build final input JSON
    const inputData = {
      model_name: "ohe_ilp",
      data: {
        users: convertedUsers,
        projects: projects,
        config: algorithmConfig,
      },
    };

    return inputData;
  },
});
