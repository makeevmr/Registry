export type UserSidebarItemSlug =
  | "hero"
  | "survey"
  | "forms"
  | "teams"
  | "projects"
  | "requests"
  | "profile";

export type UserSidebarItem = {
  slug: UserSidebarItemSlug;
  name: string;
};
