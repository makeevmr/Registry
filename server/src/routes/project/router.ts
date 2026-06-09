import projectController from "@/controllers/project";
import express, { Request, Response } from "express";
import passport from "@/middleware/passport";
import projectResultsRouter from "./results/router";
import projectLinksRouter from "./links/router";
import projectFileTypeRouter from "./file-type/router";

const projectRouter = express();

projectRouter.use("/:id/result-files", projectResultsRouter);
projectRouter.use("/:id/link", projectLinksRouter);
projectRouter.use("/file-type", projectFileTypeRouter);

/**
 * @swagger
 * tags:
 *   name: Project
 *   description: The Project managing API
 * /project/active:
 *   get:
 *     summary: Get active projects
 *     description: Fetches projects that have project.dateStart < date.Now < project.dateEnd. Also fetches tag data for each project
 *     tags: [Project]
 *     responses:
 *       200:
 *         description: projects with tags
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 projects:
 *                   type: array
 *                   items:
 *                     $ref: '#/definitions/Project'
 *                 tags:
 *                   type: array
 *                   items:
 *                     $ref: '#/definitions/Tag'
 */
projectRouter.get("/active", projectController.getActive);

/**
 * @swagger
 * tags:
 *   name: Project
 *   description: The Project managing API
 * /project/active:
 *   post:
 *     parameters:
 *       - in: body
 *         name: body
 *         schema:
 *           type: object
 *           properties:
 *             tagIds:
 *               type: array
 *               description: Every project should have at least one tag in list
 *               items:
 *                 oneOf:
 *                   - type: string
 *                   - type: number
 *               example: [1, 2, 3]
 *     summary: Get active projects
 *     description: Fetches projects that have project.dateStart < date.Now < project.dateEnd. Also fetches tag data for each project
 *     tags: [Project]
 *     responses:
 *       200:
 *         description: projects with tags
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 projects:
 *                   type: array
 *                   items:
 *                     $ref: '#/definitions/Project'
 *                 tags:
 *                   type: array
 *                   items:
 *                     $ref: '#/definitions/Tag'
 */
projectRouter.post("/active", projectController.getActive);

/**
 * @swagger
 * tags:
 *   name: Project
 *   description: The Project managing API
 * /project/new:
 *   get:
 *     summary: Get 6 latest added projects
 *     description: Based on project.dateStart
 *     tags: [Project]
 *     responses:
 *       200:
 *         description: projects with tags
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 projects:
 *                   type: array
 *                   items:
 *                     $ref: '#/definitions/Project'
 *                 tags:
 *                   type: array
 *                   items:
 *                     $ref: '#/definitions/Tag'
 */
projectRouter.get("/new", projectController.getNew);

/**
 * @swagger
 * tags:
 *   name: Project
 *   description: The Project managing API
 * /project/{id}:
 *   get:
 *     summary: Get detailed project data for public view
 *     parameters:
 *       - in: path
 *         name: id
 *         type: string
 *         description: Slug from strapi
 *         example: "project-name"
 *     tags: [Project]
 *     responses:
 *       200:
 *         description: projects with tags
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 projects:
 *                   type: array
 *                   items:
 *                     $ref: '#/definitions/Project'
 *                 tags:
 *                   type: array
 *                   items:
 *                     $ref: '#/definitions/Tag'
 *                 teams:
 *                   type: array
 *                   items:
 *                     $ref: '#/definitions/Team'
 *                 members:
 *                   type: array
 *                   items:
 *                     $ref: '#/definitions/Member'
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/definitions/User'
 */
projectRouter.get("/:id", projectController.findById);

/**
 * @swagger
 * tags:
 *   name: Project
 *   description: The Project managing API
 * /project/findmany:
 *   post:
 *     summary: Get 5 projects based on filters
 *     description: No filter property is required
 *     tags: [Project]
 *     parameters:
 *       - in: body
 *         name: body
 *         schema:
 *           type: object
 *           properties:
 *             filters:
 *               $ref: '#/definitions/ProjectFilters'
 *             page:
 *               type: number
 *               example: 1
 *     responses:
 *       200:
 *         description: projects with tags
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 projects:
 *                   type: array
 *                   items:
 *                     $ref: '#/definitions/Project'
 *                 tags:
 *                   type: array
 *                   items:
 *                     $ref: '#/definitions/Tag'
 */
projectRouter.post("/findmany", projectController.findMany);

/**
 * @swagger
 * tags:
 *   name: Project
 *   description: The Project managing API
 * /project:
 *   post:
 *     summary: Create a new project (employers only)
 *     description: Authenticated employer creates a project. Requires a JWT cookie. The creating employer is stored as the project owner.
 *     tags: [Project]
 *     parameters:
 *       - in: header
 *         name: Cookie
 *         type: string
 *         required: true
 *         description: Should contain user JWT-token
 *       - in: body
 *         name: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *               example: "Проект 1"
 *             shortName:
 *               type: string
 *               description: English-only (A-Z, a-z, spaces). Used to build the slug.
 *               example: "Simple test project name"
 *             description:
 *               type: string
 *               example: "Описание проекта"
 *             dateStart:
 *               type: string
 *               example: 2026-01-01
 *             dateEnd:
 *               type: string
 *               example: 2026-06-01
 *             enrollmentStart:
 *               type: string
 *               example: 2026-01-01
 *             enrollmentEnd:
 *               type: string
 *               example: 2026-02-01
 *             client:
 *               type: string
 *               example: "ООО Компания"
 *             clientContact:
 *               type: string
 *               example: "tg: @username"
 *             tags:
 *               type: array
 *               items:
 *                 type: string
 *               example: ["ИТ", "Финансы"]
 *     responses:
 *       '201':
 *         description: Created project id and slug
 *       '403':
 *         description: User is not an employer
 */
projectRouter.post(
  "/",
  passport.authenticate("jwt-authenticate"),
  projectController.create
);

/**
 * @swagger
 * /project/{id}:
 *   put:
 *     summary: Update a project (owning employer only)
 *     description: Authenticated employer who owns the project updates its editable fields (name, description, dates, client, contact, team limit, tags, requirements). slug/shortName are immutable.
 *     tags: [Project]
 *     parameters:
 *       - in: header
 *         name: Cookie
 *         type: string
 *         required: true
 *         description: Should contain user JWT-token
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *         description: Project slug
 *       - in: body
 *         name: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             description:
 *               type: string
 *               example: "Новое описание проекта"
 *     responses:
 *       '200':
 *         description: Update result
 *       '403':
 *         description: User is not the owning employer
 */
projectRouter.put(
  "/:id",
  passport.authenticate("jwt-authenticate"),
  projectController.update
);

export default projectRouter;
