import { User, UserCreate } from "../types/types";

export const staticUserResponseStrapi = {
  data: [
    {
      id: 2,
      attributes: {
        name: "Сатурнова Татьяна Тимофеевна ",
        email: "st072603@student.spbu.ru",
        services: [
          {
            provider: "spbu",
            value: "st072603@student.spbu.ru",
          },
        ],
      },
    },
  ],
};

export const staticUser: User = {
  id: 2,
  name: "Сатурнова Татьяна Тимофеевна ",
  email: "st072603@student.spbu.ru",
  phone: "+7 999 999 99 99",
  userType: "student",
};

export const staticUserCreateResponseStrapi = {
  data: {
    id: 2,
    attributes: {
      name: "Сатурнова Татьяна Тимофеевна ",
      email: "st072603@student.spbu.ru",
      phone: "+7 999 999 99 99",
      services: [
        {
          provider: "spbu",
          value: "st072603@student.spbu.ru",
        },
      ],
    },
  },
};

export const staticUserCreate: UserCreate = {
  name: "Сатурнова Татьяна Тимофеевна ",
  email: "st072603@student.spbu.ru",
  phone: "+7 999 999 99 99",
};
