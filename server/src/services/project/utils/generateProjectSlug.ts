// Builds a project slug from the English short name plus today's date.
// "Simple test project name" -> "simple-test-project-name-09-06-2026"
export const generateProjectSlug = (shortName: string): string => {
  const base = shortName.trim().toLowerCase().replace(/\s+/g, "-");

  const now = new Date();
  const dd = String(now.getDate()).padStart(2, "0");
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const yyyy = now.getFullYear();

  return `${base}-${dd}-${mm}-${yyyy}`;
};
