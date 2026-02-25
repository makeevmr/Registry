import { User } from "@/entities/user";
import { UserStrapi, UserWithFormsStrapi } from "../../types/user";
import { FormResult } from "@/entities/form";

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
  };
};

export const getUserFormResultsFromStrapiDTO = (
  user: UserWithFormsStrapi
): FormResult[] => {
  return user.data.attributes.forms.map((form) => ({
    id: form.id,
    file: form.file.data ? form.file.data.id : null,
    form: form.form.data ? form.form.data.id : null,
    date: form.date,
  }));
};
