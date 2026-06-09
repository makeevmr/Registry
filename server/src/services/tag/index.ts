import { Tag } from "@/entities/tag";
import tagRepository from "@/repositories/tag";

const tagServiceFactory = () => {
  return Object.freeze({
    findInFilters,
    findAll,
  });

  async function findInFilters(query?: string): Promise<Tag[]> {
    return tagRepository.findMany({ query, limit: 5 });
  }

  // Full tag list (used by the project-creation form so all tags are selectable,
  // not just the 5-item filter suggestions).
  async function findAll(): Promise<Tag[]> {
    return tagRepository.findMany({ limit: 200 });
  }
};

const tagService = tagServiceFactory();

export default tagService;
