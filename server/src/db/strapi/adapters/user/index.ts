import { User } from "@/entities/user";
import { UserStrapi } from "../../types/user";

const findUserEmail = (user: UserStrapi) => {
  const email = user.data.attributes.services.find(
    (service) => service.provider === "spbu"
  );

  if (!email) return "";

  return email.value.indexOf("@") == -1
    ? email.value + "@student.spbu.ru"
    : email.value;
};

export const getUserFromStrapiDTO = (user: UserStrapi): User => {
  const { services, ...attributes } = user.data.attributes;

  return {
    id: user.data.id,
    name: attributes.name,
    email: findUserEmail(user),
    phone: attributes.phone || "",
    userType: attributes.userType || "student",
  };
};
