import { Profile, ProfileDTO } from "../types/types";

export const staticProfileTeamAssigned: ProfileDTO = {
  forms: [
    {
      id: 1,
      name: "Анкета для студентов ПМ-ПУ",
      link: "https://docs.google.com/forms/d/e/1FAIpQLSeucShuu9WjbZVa0gD1-MjQgySPoO9sh6L8kbQGl04BvF55fg/viewform?usp=sf_link",
      completed: "2023-10-26T15:43:25.385Z",
    },
    {
      id: 2,
      name: "Новая анкета для студентов ПМ-ПУ",
      link: "https://vk.com",
      completed: null,
    },
  ],
  survey: null,
  requests: [],
  teams: [
    {
      id: 4,
      name: "Горшков И.Г., Гришина С.К., Авдеева С.Д., Ермилов И.М., Евдокимова В.А., Лалуев Д.В. - Биология растений в эпоху глобальных изменений климата",
      members: [2, 3, 1, 5, 4, 21],
      project: "1",
    },
  ],
  members: [
    {
      id: 2,
      roles: ["Системный администратор"],
      name: "Горшков И.Г. - Системный администратор",
      isAdministrator: false,
      user: 5,
      team: 4,
    },
    {
      id: 3,
      roles: ["Инженер технической поддержки"],
      name: "Гришина С.К. - Инженер технической поддержки",
      isAdministrator: false,
      user: 6,
      team: 4,
    },
    {
      id: 1,
      roles: ["Teamlead"],
      name: "Авдеева С.Д. - Teamlead",
      isAdministrator: true,
      user: 3,
      team: 4,
    },
    {
      id: 5,
      roles: ["Frontend-разработчик"],
      name: "Ермилов И.М. - Frontend-разработчик",
      isAdministrator: false,
      user: 8,
      team: 4,
    },
    {
      id: 4,
      roles: ["Тестировщик (QA Engineer)"],
      name: "Евдокимова В.А. - Тестировщик (QA Engineer)",
      isAdministrator: false,
      user: 7,
      team: 4,
    },
    {
      id: 21,
      roles: ["Разработчик"],
      name: "Лалуев Д.В. - Разработчик",
      isAdministrator: true,
      user: 24,
      team: 4,
    },
  ],
  users: [
    {
      id: 5,
      name: "Горшков Иван Григорьевич",
    },
    {
      id: 6,
      name: "Гришина София Кирилловна",
    },
    {
      id: 3,
      name: "Авдеева София Данииловна",
    },
    {
      id: 8,
      name: "Ермилов Иван Макарович",
    },
    {
      id: 7,
      name: "Евдокимова Владислава Андреевна",
    },
    { id: 24, name: "Лалуев Денис Витальевич" },
  ],
  projects: [
    {
      id: "1",
      name: "Биология растений в эпоху глобальных изменений климата",
      description:
        "Необходимо провести анализ адаптации растений к экстремальным условиям, возникающим в результате глобальных изменений климата. Важно оценить воздействие глобальных изменений климата на биоразнообразие растительного мира. Задачей является выявление потенциальных угроз экосистемам и сельскому хозяйству, обусловленных изменениями климата.",
      dateStart: "2023-10-18",
      dateEnd: "2023-12-01",
      enrollmentStart: "2023-08-20",
      enrollmentEnd: "2023-10-17",
      clientContact: "Иванов П. М.",
      curator: "Калашникова П. М.",
      client: 'ООО "Рога и Копыто"',
      teamLimit: 2,
      teams: [4],
      tags: [],
    },
  ],
  user: {
    email: "st461158@student.spbu.ru",
    phone: "+7 999 999 99 99",
    fullName: {
      name: "Иван",
      surname: "Иванов",
      patronymic: "Иванович",
    },
    teams: [4],
    administratedTeams: [4],
    projects: [],
  },
};

export const staticProfileTeamHiring: ProfileDTO = {
  forms: [
    {
      id: 1,
      name: "Анкета для студентов ПМ-ПУ",
      link: "https://docs.google.com/forms/d/e/1FAIpQLSeucShuu9WjbZVa0gD1-MjQgySPoO9sh6L8kbQGl04BvF55fg/viewform?usp=sf_link",
      completed: "2023-10-26T15:43:25.385Z",
    },
    {
      id: 2,
      name: "Новая анкета для студентов ПМ-ПУ",
      link: "https://vk.com",
      completed: null,
    },
  ],
  survey: null,
  requests: [{ id: 29, team: 4, project: "1", files: [] }],
  teams: [
    {
      id: 4,
      name: "Горшков И.Г., Гришина С.К., Авдеева С.Д., Ермилов И.М., Евдокимова В.А., Лалуев Д.В. - Биология растений в эпоху глобальных изменений климата",
      members: [2, 3, 1, 5, 4, 21],
      project: null,
      requests: [29],
    },
  ],
  members: [
    {
      id: 2,
      roles: ["Системный администратор"],
      name: "Горшков И.Г. - Системный администратор",
      isAdministrator: false,
      user: 5,
      team: 4,
    },
    {
      id: 3,
      roles: ["Инженер технической поддержки"],
      name: "Гришина С.К. - Инженер технической поддержки",
      isAdministrator: false,
      user: 6,
      team: 4,
    },
    {
      id: 1,
      roles: ["Teamlead"],
      name: "Авдеева С.Д. - Teamlead",
      isAdministrator: true,
      user: 3,
      team: 4,
    },
    {
      id: 5,
      roles: ["Frontend-разработчик"],
      name: "Ермилов И.М. - Frontend-разработчик",
      isAdministrator: false,
      user: 8,
      team: 4,
    },
    {
      id: 4,
      roles: ["Тестировщик (QA Engineer)"],
      name: "Евдокимова В.А. - Тестировщик (QA Engineer)",
      isAdministrator: false,
      user: 7,
      team: 4,
    },
    {
      id: 21,
      roles: ["Разработчик"],
      name: "Лалуев Д.В. - Разработчик",
      isAdministrator: true,
      user: 24,
      team: 4,
    },
  ],
  users: [
    {
      id: 5,
      name: "Горшков Иван Григорьевич",
    },
    {
      id: 6,
      name: "Гришина София Кирилловна",
    },
    {
      id: 3,
      name: "Авдеева София Данииловна",
    },
    {
      id: 8,
      name: "Ермилов Иван Макарович",
    },
    {
      id: 7,
      name: "Евдокимова Владислава Андреевна",
    },
    { id: 24, name: "Лалуев Денис Витальевич" },
  ],
  projects: [
    {
      id: "1",
      name: "Биология растений в эпоху глобальных изменений климата",
      description:
        "Необходимо провести анализ адаптации растений к экстремальным условиям, возникающим в результате глобальных изменений климата. Важно оценить воздействие глобальных изменений климата на биоразнообразие растительного мира. Задачей является выявление потенциальных угроз экосистемам и сельскому хозяйству, обусловленных изменениями климата.",
      dateStart: "2023-10-18",
      dateEnd: "2023-12-01",
      enrollmentStart: "2023-08-20",
      enrollmentEnd: "2023-10-17",
      clientContact: "Иванов П. М.",
      curator: "Калашникова П. М.",
      client: 'ООО "Рога и Копыто"',
      teamLimit: 2,
      teams: [],
      tags: [],
    },
  ],
  user: {
    email: "email@mail.ru",
    phone: "+7 999 999 99 99",
    fullName: {
      name: "Иван",
      surname: "Иванов",
      patronymic: "Иванович",
    },
    teams: [4],
    administratedTeams: [4],
    projects: ["1"],
  },
};
