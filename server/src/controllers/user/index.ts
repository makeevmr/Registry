import { BadRequestError, UnauthorizedError } from "@/helpers/errors";
import profileService from "@/services/profile";
import projectStatusService from "@/services/project-status";
import { NextFunction, Request, Response } from "express";

const userControllerFactory = () => {
  return Object.freeze({
    getProjectStatusData,
    getUser,
    getProfileData,
  });

  async function getProjectStatusData(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.user)
        throw new UnauthorizedError(
          "req.user not specified in userController.getProjectStatusData"
        );

      if (!req.params.projectId)
        throw new BadRequestError("Missing project identifier");

      const info = await projectStatusService.getAssignableTeams(
        +req.params.projectId,
        req.user.id
      );

      res.status(200).json(info);
    } catch (err) {
      next(err);
    }
  }

  async function getProfileData(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.user) throw new UnauthorizedError("req.user not specified");

      const result = await profileService.getUserData(req.user);

      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }

  async function getUser(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new UnauthorizedError("req.user not specified");

      res.status(200).send(req.user);
    } catch (err) {
      next(err);
    }
  }
};

const userController = userControllerFactory();

export default userController;
