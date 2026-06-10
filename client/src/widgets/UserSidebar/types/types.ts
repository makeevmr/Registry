export type UserSidebarItemSlug =
  | "hero"
  | "survey"
  | "teams"
  | "projects"
  | "requests"
  | "profile";

export type UserSidebarItem = {
  slug: UserSidebarItemSlug;
  name: string;
};
