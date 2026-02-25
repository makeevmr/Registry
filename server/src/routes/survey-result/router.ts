import express from "express";
import passport from "@/middleware/passport";
import surveyResultController from "@/controllers/survey-result";

const surveyResultRouter = express();

/**
 * @swagger
 * tags:
 *   name: Survey
 *   description: The Survey managing API
 * /survey:
 *   post:
 *     tags: [Survey]
 *     parameters:
 *       - in: header
 *         name: Cookie
 *         type: string
 *         required: true
 *         description: Should contain user JWT-token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Complete survey data with all 5 chapters
 *     summary: Submit internal survey
 *     responses:
 *       '200':
 *         description: Survey submitted successfully
 */
surveyResultRouter.post(
  "/",
  passport.authenticate("jwt-authenticate"),
  surveyResultController.submit
);

export default surveyResultRouter;
