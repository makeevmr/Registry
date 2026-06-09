import { IProjectSingle, IProjectSingleDTO } from "../types/types";

const now = new Date("01 Sep 2023 18:30 GMT");

const tommorow = new Date(now);
tommorow.setDate(tommorow.getDate() + 1);

const yesterday = new Date(now);
yesterday.setDate(yesterday.getDate() - 1);

export const staticProjectSingleNotStarted: IProjectSingle = {
  id: "1",
  name: "Биология растений в эпоху глобальных изменений климата",
  description:
    "Необходимо провести анализ адаптации растений к экстремальным условиям, возникающим в результате глобальных изменений климата. Важно оценить воздействие глобальных изменений климата на биоразнообразие растительного мира. Задачей является выявление потенциальных угроз экосистемам и сельскому хозяйству, обусловленных изменениями климата.",
  dateStart: tommorow,
  dateEnd: tommorow,
  enrollmentStart: yesterday,
  enrollmentEnd: tommorow,
  clientContact: "Иванов П. М.",
  curator: "Калашникова П. М.",
  client: 'ООО "Рога и Копыто"',
  teamLimit: 2,
  tags: [8],
  teams: [],
  related: [],
  links: [],
  developerRequirements: [
    "Опыт работы с лабораторным оборудованием и инструментами, связанными с биологией растений",
    "Глубокое понимание биологии растений и их реакции на изменения климата",
    "Способность оценивать влияние глобальных изменений климата на экосистемы и биоразнообразие",
  ],
  projectRequirements: [],
  descriptionFiles: [
    {
      id: 1,
      name: "Stats",
      date: "2023-11-06",
      url: "/uploads/100_ecba989f3f.jpg",
      type: "JPG",
      size: "69Кб",
    },
    {
      id: 2,
      name: "Pirated Textbook",
      date: "2023-11-06",
      url: "/uploads/Design_Patterns_Elements_of_Reusable_Object_Oriented_Software_427cc0144d.pdf",
      type: "FILE",
      size: "19196Кб",
    },
  ],
  resultFiles: [
    {
      id: 53,
      name: "Anketa.docx",
      date: "2023-11-06",
      url: "/uploads/Anketa_a4ad15cee9.docx",
      type: "FILE",
      size: "20Кб",
    },
  ],
  documents: [
    {
      id: 53,
      name: "Anketa.docx",
      date: "2023-11-06",
      category: "Отчёт",
      url: "/uploads/Anketa_a4ad15cee9.docx",
      type: "FILE",
      size: "20Кб",
    },
  ],
  requestCount: 0,
  employerOwner: null,
};

export const staticProjectSingleOngoing: IProjectSingle = {
  id: "1",
  name: "Биология растений в эпоху глобальных изменений климата",
  description:
    "Необходимо провести анализ адаптации растений к экстремальным условиям, возникающим в результате глобальных изменений климата. Важно оценить воздействие глобальных изменений климата на биоразнообразие растительного мира. Задачей является выявление потенциальных угроз экосистемам и сельскому хозяйству, обусловленных изменениями климата.",
  dateStart: yesterday,
  dateEnd: tommorow,
  enrollmentStart: yesterday,
  enrollmentEnd: yesterday,
  clientContact: "Иванов П. М.",
  curator: "Калашникова П. М.",
  client: 'ООО "Рога и Копыто"',
  teamLimit: 1,
  tags: [8],
  related: [],
  links: [],
  teams: [4],
  developerRequirements: [
    "Опыт работы с лабораторным оборудованием и инструментами, связанными с биологией растений",
    "Глубокое понимание биологии растений и их реакции на изменения климата",
    "Способность оценивать влияние глобальных изменений климата на экосистемы и биоразнообразие",
  ],
  projectRequirements: [],
  descriptionFiles: [
    {
      id: 1,
      name: "Stats",
      date: "2023-11-06",
      url: "/uploads/100_ecba989f3f.jpg",
      type: "JPG",
      size: "69Кб",
    },
    {
      id: 2,
      name: "Pirated Textbook",
      date: "2023-11-06",
      url: "/uploads/Design_Patterns_Elements_of_Reusable_Object_Oriented_Software_427cc0144d.pdf",
      type: "FILE",
      size: "19196Кб",
    },
  ],
  resultFiles: [
    {
      id: 53,
      name: "Anketa.docx",
      date: "2023-11-06",
      url: "/uploads/Anketa_a4ad15cee9.docx",
      type: "FILE",
      size: "20Кб",
    },
  ],
  documents: [
    {
      id: 53,
      name: "Anketa.docx",
      date: "2023-11-06",
      category: "Отчёт",
      url: "/uploads/Anketa_a4ad15cee9.docx",
      type: "FILE",
      size: "20Кб",
    },
  ],
  requestCount: 0,
  employerOwner: null,
};

export const staticProjectSingleCompleted: IProjectSingle = {
  id: "1",
  name: "Биология растений в эпоху глобальных изменений климата",
  description:
    "Необходимо провести анализ адаптации растений к экстремальным условиям, возникающим в результате глобальных изменений климата. Важно оценить воздействие глобальных изменений климата на биоразнообразие растительного мира. Задачей является выявление потенциальных угроз экосистемам и сельскому хозяйству, обусловленных изменениями климата.",
  dateStart: yesterday,
  dateEnd: yesterday,
  enrollmentStart: yesterday,
  enrollmentEnd: yesterday,
  related: [],
  links: [],
  clientContact: "Иванов П. М.",
  curator: "Калашникова П. М.",
  client: 'ООО "Рога и Копыто"',
  teamLimit: 1,
  tags: [8],
  teams: [4],
  developerRequirements: [
    "Опыт работы с лабораторным оборудованием и инструментами, связанными с биологией растений",
    "Глубокое понимание биологии растений и их реакции на изменения климата",
    "Способность оценивать влияние глобальных изменений климата на экосистемы и биоразнообразие",
  ],
  projectRequirements: [],
  documents: [
    {
      id: 53,
      name: "Anketa.docx",
      date: "2023-11-06",
      category: "Отчёт",
      url: "/uploads/Anketa_a4ad15cee9.docx",
      type: "FILE",
      size: "20Кб",
    },
  ],
  descriptionFiles: [
    {
      id: 1,
      name: "Stats",
      date: "2023-11-06",
      url: "/uploads/100_ecba989f3f.jpg",
      type: "JPG",
      size: "69Кб",
    },
    {
      id: 2,
      name: "Pirated Textbook",
      date: "2023-11-06",
      url: "/uploads/Design_Patterns_Elements_of_Reusable_Object_Oriented_Software_427cc0144d.pdf",
      type: "FILE",
      size: "19196Кб",
    },
  ],
  resultFiles: [
    {
      id: 53,
      name: "Anketa.docx",
      date: "2023-11-06",
      url: "/uploads/Anketa_a4ad15cee9.docx",
      type: "FILE",
      size: "20Кб",
    },
  ],
  requestCount: 0,
  employerOwner: null,
};
