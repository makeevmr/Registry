import { FormResultStrapi } from "../components/form-result";

interface UserStrapiInner {
  id: number;
  attributes: {
    name: string;
    phone: string;
    userType: "student" | "employer";
    services: {
      provider: string;
      value: string;
    }[];
  };
}

export interface UserStrapi {
  data: UserStrapiInner;
}

export interface UserListStrapi {
  data: UserStrapiInner[];
}

interface UserWithFormsStrapiInner {
  id: number;
  attributes: { forms: FormResultStrapi[] };
}

export interface UserWithFormsStrapi {
  data: UserWithFormsStrapiInner;
}

export interface UserWithFormsListStrapi {
  data: UserWithFormsStrapiInner[];
}
