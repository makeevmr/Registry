import { ProjectCreate, ProjectUpdate, ProjectFilters } from "@/entities/project";
import { User } from "@/entities/user";
import { BadRequestError, ForbiddenError } from "@/helpers/errors";
import projectRepository from "@/repositories/project";
import tagRepository from "@/repositories/tag";
import { generateProjectSlug } from "./utils/generateProjectSlug";

const SHORT_NAME_REGEX = /^[A-Za-z ]+$/;

const projectServiceFactory = () => {
  return Object.freeze({
    getActive,
    getNew,
    findById,
    findMany,
    create,
    update,
  });

  // Shared validation for the common (create + edit) fields. Returns the
  // resolved tag ids and the sanitized requirement lists.
  async function validateAndResolve(data: ProjectUpdate) {
    const requiredStrings: (keyof ProjectUpdate)[] = [
      "name",
      "description",
      "dateStart",
      "dateEnd",
      "enrollmentStart",
      "enrollmentEnd",
      "client",
      "clientContact",
    ];

    for (const field of requiredStrings) {
      const value = data[field];
      if (typeof value !== "string" || !value.trim())
        throw new BadRequestError(`Missing required field: ${field}`);
    }

    if (!Array.isArray(data.tags) || !data.tags.length)
      throw new BadRequestError("At least one tag is required");

    if (!Number.isInteger(data.teamLimit) || data.teamLimit < 1)
      throw new BadRequestError("teamLimit must be a positive integer");

    const tags = await tagRepository.findByNames(data.tags);
    const tagIds = tags.map((tag) => tag.id);

    if (!tagIds.length)
      throw new BadRequestError("None of the provided tags exist");

    const developerRequirements = (data.developerRequirements || [])
      .map((req) => req.trim())
      .filter(Boolean);
    const projectRequirements = (data.projectRequirements || [])
      .map((req) => req.trim())
      .filter(Boolean);

    return { tagIds, developerRequirements, projectRequirements };
  }

  async function getActive(tagIds?: string[]) {
    return projectRepository.findMany({
      dateStart: new Date(),
      dateEnd: new Date(),
      tags: tagIds,
    });
  }

  async function getNew() {
    return projectRepository.getNew(6);
  }

  async function findById(id: number) {
    return projectRepository.findOne(id);
  }

  async function findMany(filters?: ProjectFilters, page?: number) {
    return projectRepository.findMany(filters, page);
  }

  async function create(data: ProjectCreate, user: User) {
    // Only employers can create projects.
    if (user.userType !== "employer") {
      throw new ForbiddenError(
        "EmployerCreateProjectForbidden",
        undefined,
        "Only employers can create projects."
      );
    }

    if (typeof data.shortName !== "string" || !data.shortName.trim())
      throw new BadRequestError("Missing required field: shortName");

    if (!SHORT_NAME_REGEX.test(data.shortName.trim()))
      throw new BadRequestError(
        "Short name must contain only Latin letters (A-Z, a-z) and spaces"
      );

    const { tagIds, developerRequirements, projectRequirements } =
      await validateAndResolve(data);

    const slug = generateProjectSlug(data.shortName);

    return projectRepository.create(
      { ...data, developerRequirements, projectRequirements },
      {
        slug,
        tagIds,
        employerId: user.id,
      }
    );
  }

  async function update(slug: string, data: ProjectUpdate, user: User) {
    if (user.userType !== "employer") {
      throw new ForbiddenError(
        "EmployerEditProjectForbidden",
        undefined,
        "Only employers can edit projects."
      );
    }

    const existing = await projectRepository.findOne(slug);

    if (!existing || !existing.project)
      throw new BadRequestError("Project not found");

    // Only the owning employer may edit.
    if (existing.project.employerOwner !== user.id) {
      throw new ForbiddenError(
        "NotProjectOwner",
        undefined,
        "Only the project owner can edit this project."
      );
    }

    const { tagIds, developerRequirements, projectRequirements } =
      await validateAndResolve(data);

    return projectRepository.update(
      slug,
      { ...data, developerRequirements, projectRequirements },
      { tagIds }
    );
  }
};

const projectService = projectServiceFactory();

export default projectService;
