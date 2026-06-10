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
