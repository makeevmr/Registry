import { UnauthorizedError } from "@/helpers/errors";
import surveyResultService from "@/services/survey-result";
import { NextFunction, Request, Response } from "express";

const surveyResultControllerFactory = () => {
  return Object.freeze({
    submit,
  });

  async function submit(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user)
        throw new UnauthorizedError(
          "req.user not specified in surveyResultController.submit"
        );

      const result = await surveyResultService.submit(req.body, req.user);

      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }
};

const surveyResultController = surveyResultControllerFactory();

export default surveyResultController;
