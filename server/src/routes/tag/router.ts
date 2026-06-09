import tagController from "@/controllers/tag";
import express from "express";

const tagRouter = express();

/**
 * @swagger
 * /tag/all:
 *   get:
 *     tags: [Tag]
 *     summary: Get the full list of tags
 *     description: Returns all tags (used by the project-creation form).
 *     responses:
 *       '200':
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/Tag'
 */
tagRouter.get("/all", tagController.findAll);

/**
 * @swagger
 * tags:
 *   name: Tag
 *   description: The Tag managing API
 * /tag/filters/{query?}:
 *   get:
 *     tags: [Tag]
 *     parameters:
 *       - in: path
 *         name: query
 *         type: string
 *         description: User text query
 *         example: "my tag"
 *     summary: Get a list of 5 tag suggestions based on search query
 *     description: Uses strapi's findMany of the Tag's content type
 *     responses:
 *       '200':
 *         content:
 *           application/json:
 *             description: An array of tags.
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/Tag'
 */
tagRouter.get("/filters/:query?", tagController.findInFilters);

/**
 * @swagger
 * tags:
 *   name: Tag
 *   description: The Tag managing API
 * /tag/filters/{query?}:
 *   post:
 *     tags: [Tag]
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             query:
 *               type: string
 *               example: "Fronte"
 *               description: User text query
 *     summary: Get a list of 5 tag suggestions based on search query
 *     description: Uses strapi's findMany of the Tag's content type
 *     responses:
 *       '200':
 *         content:
 *           application/json:
 *             description: An array of tags.
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/Tag'
 */
tagRouter.post("/filters", tagController.findInFilters);

export default tagRouter;
