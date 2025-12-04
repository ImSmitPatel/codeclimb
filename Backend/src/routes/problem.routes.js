import express from "express";
import { authMiddleware, checkAdmin } from "../middleware/auth.middleware.js";
import { createProblem, deleteProblemById, getAllProblems, getAllProblemsSolvedByUser, getProblemById, updateProblemById } from "../controllers/problem.controller.js";


const problemRoutes = express.Router();
/**
 * @swagger
 * tags:
 *   name: Problems
 *   description: API for managing coding problems
 */


/**
 * @swagger
 * /api/v1/problems/create-problem:
 *   post:
 *     summary: Create a new coding problem (Admin only)
 *     tags: [Problems]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - difficulty
 *               - testcases
 *               - referenceSolutions
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               difficulty:
 *                 type: string
 *                 example: EASY
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               examples:
 *                 type: array
 *                 items:
 *                   type: object
 *               constraints:
 *                 type: string
 *               testcases:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     input:
 *                       type: string
 *                     output:
 *                       type: string
 *               codeSnippets:
 *                 type: object
 *               referenceSolutions:
 *                 type: object
 *     responses:
 *       201:
 *         description: Problem created successfully
 *       400:
 *         description: Invalid language or failed testcase
 *       403:
 *         description: Forbidden - Admin only
 *       500:
 *         description: Server error
 */
problemRoutes.post("/create-problem", authMiddleware, checkAdmin, createProblem);

/**
 * @swagger
 * /api/v1/problems/get-all-problems:
 *   get:
 *     summary: Get all problems
 *     tags: [Problems]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Problems fetched successfully
 *       404:
 *         description: No problems found
 *       500:
 *         description: Server error
 */
problemRoutes.get("/get-all-problems", authMiddleware, getAllProblems);

/**
 * @swagger
 * /api/v1/problems/get-problem/{id}:
 *   get:
 *     summary: Get problem by ID
 *     tags: [Problems]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Problem ID
 *     responses:
 *       200:
 *         description: Problem fetched successfully
 *       404:
 *         description: Problem not found
 *       500:
 *         description: Server error
 */
problemRoutes.get("/get-problem/:id", authMiddleware, getProblemById);

/**
 * @swagger
 * /api/v1/problems/update-problem/{id}:
 *   put:
 *     summary: Update a problem (Admin only)
 *     tags: [Problems]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Problem ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               difficulty:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               examples:
 *                 type: array
 *                 items:
 *                   type: object
 *               constraints:
 *                 type: string
 *               testcases:
 *                 type: array
 *                 items:
 *                   type: object
 *               codeSnippets:
 *                 type: object
 *               referenceSolutions:
 *                 type: object
 *     responses:
 *       200:
 *         description: Problem updated successfully
 *       400:
 *         description: Invalid language or failed testcase
 *       403:
 *         description: Forbidden - Admin only
 *       404:
 *         description: Problem not found
 *       500:
 *         description: Server error
 */
problemRoutes.put("/update-problem/:id", authMiddleware, checkAdmin, updateProblemById);

/**
 * @swagger
 * /api/v1/problems/delete-problem/{id}:
 *   delete:
 *     summary: Delete a problem (Admin only)
 *     tags: [Problems]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Problem ID
 *     responses:
 *       200:
 *         description: Problem deleted successfully
 *       403:
 *         description: Forbidden - Admin only
 *       404:
 *         description: Problem not found
 *       500:
 *         description: Server error
 */
problemRoutes.delete("/delete-problem/:id", authMiddleware, checkAdmin, deleteProblemById);

/**
 * @swagger
 * /api/v1/problems/get-solved-problems-user:
 *   get:
 *     summary: Get all problems solved by authenticated user
 *     tags: [Problems]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Solved problems fetched successfully
 *       500:
 *         description: Server error
 */
problemRoutes.get("/get-solved-problems-user", authMiddleware, getAllProblemsSolvedByUser);

export default problemRoutes;