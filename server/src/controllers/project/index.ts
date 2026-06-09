import { getProjectFiltersFromDTO } from "@/entities/project";
import { BadRequestError, UnauthorizedError } from "@/helpers/errors";
import projectService from "@/services/project";
import projectLinksService from "@/services/project-links";
import projectResultsService from "@/services/project-results";
import projectResultService from "@/services/project-results";
import { NextFunction, Request, Response } from "express";

const projectControllerFactory = () => {
  return Object.freeze({
    getActive,
    getNew,
    findById,
    findMany,
    create,
    update,
  });

  async function update(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user)
        throw new UnauthorizedError(
          "req.user not specified in projectController.update"
        );

      if (!req.params.id)
        throw new BadRequestError("Missing project identifier");

      const result = await projectService.update(
        req.params.id,
        req.body,
        req.user
      );

      res.status(200).json({ success: result });
    } catch (err) {
      next(err);
    }
  }

  async function create(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user)
        throw new UnauthorizedError(
          "req.user not specified in projectController.create"
        );

      const result = await projectService.create(req.body, req.user);

      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  }

  async function getActive(req: Request, res: Response, next: NextFunction) {
    try {
      const tagIds = req.body ? (req.body.tagIds as string[]) : undefined;

      const projects = await projectService.getActive(tagIds);

      res.status(200).json(projects);
    } catch (err) {
      next(err);
    }
  }

  async function getNew(req: Request, res: Response, next: NextFunction) {
    try {
      const projects = await projectService.getNew();

      res.status(200).json(projects);
    } catch (err) {
      next(err);
    }
  }

  async function findById(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.body.id && !req.params.id)
        throw new BadRequestError("Missing project identifier");

      const result = await projectService.findById(
        req.body.id || req.params.id
      );

      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }

  async function findMany(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await projectService.findMany(
        getProjectFiltersFromDTO(req.body.filters),
        +req.body.page || 1
      );

      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }
};

const projectController = projectControllerFactory();
export default projectController;
