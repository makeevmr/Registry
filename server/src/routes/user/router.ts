import express, { NextFunction, Request, Response } from "express";
import passport from "@/middleware/passport";
import userController from "@/controllers/user";
import { strapi } from "@/db/strapi/client";
import userRoleRouter from "./role/router";

const userRouter = express();

userRouter.use("/role", userRoleRouter);

/**
 * @swagger
 * tags:
 *   name: User
 *   description: The User managing API
 * /user/projectstatus/{projectId}:
 *   get:
 *     tags: [User]
 *     parameters:
 *       - in: header
 *         name: Cookie
 *         type: string
 *         required: true
 *         description: Should contain user JWT-token
 *       - in: path
 *         name: projectId
 *         required: true
 *         type: string
 *         description: Project id
 *     summary: Get info about user's teams' applications relative to a project
 *     description: Uses strapi's findMany of the Tag's content type
 *     responses:
 *       '200':
 *         content:
 *           application/json:
 *             description: An array of tags.
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     assignableTeams:
 *                       type: array
 *                       description: List of teams that the user is authorized to make application requests for relative to the project
 *                       items:
 *                         type: number
 *                         description: Team id
 *                         example: 25
 *                     hasTeamApplied:
 *                       type: boolean
 *                       description: Whether the user is in a team that has applied for the project
 *                       example: true
 *                 teams:
 *                    type: array
 *                    items:
 *                      $ref: '#/definitions/Team'
 *
 *
 */
userRouter.get(
  "/projectstatus/:projectId",
  passport.authenticate("jwt-authenticate"),
  userController.getProjectStatusData
);

/**
 * @swagger
 * /user/profile:
 *   get:
 *     tags: [User]
 *     parameters:
 *       - in: header
 *         name: Cookie
 *         type: string
 *         required: true
 *         description: Should contain user JWT-token
 *     summary: Get current user's profile data
 *     responses:
 *       '200':
 *         content:
 *           application/json:
 *             description: Profile data
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/definitions/UserProfile'
 *                 teams:
 *                   type: array
 *                   items:
 *                     $ref: '#/definitions/Team'
 *                 projects:
 *                   type: array
 *                   items:
 *                     $ref: '#/definitions/Project'
 *                 members:
 *                   type: array
 *                   items:
 *                     $ref: '#/definitions/Member'
 *                 requests:
 *                   type: array
 *                   items:
 *                     $ref: '#/definitions/Request'
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/definitions/User'
 */
userRouter.get(
  "/profile",
  passport.authenticate("jwt-authenticate"),
  userController.getProfileData
);

/**
 * @swagger
 * /user/:
 *   get:
 *     tags: [User]
 *     parameters:
 *       - in: header
 *         name: Cookie
 *         type: string
 *         required: true
 *         description: Should contain user JWT-token
 *     summary: Get current user
 *     responses:
 *       '200':
 *         content:
 *           application/json:
 *             description: An array of tags.
 *             schema:
 *               $ref: '#/definitions/User'
 */
userRouter.get(
  "/",
  passport.authenticate("jwt-authenticate"),
  userController.getUser
);

export default userRouter;
