import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { getAllSubmissions, getSubmissionCountForProblem, getSubmissionForProblemForUser } from '../controllers/submission.controller.js';

const submissionRoutes = express.Router();
/**
 * @swagger
 * tags:
 *   name: Submissions
 *   description: API for managing submissions
 */



/**
 * @swagger
 * /api/v1/submission/get-all-submissions:
 *   get:
 *     summary: Get all submissions of authenticated user
 *     tags: [Submissions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Submissions fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 count:
 *                   type: integer
 *                 submissions:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Server error
 */
submissionRoutes.get("/get-all-submissions", authMiddleware, getAllSubmissions);

/**
 * @swagger
 * /api/v1/submission/get-submissions-by-problem-user/{problemId}:
 *   get:
 *     summary: Get all submissions of authenticated user for a specific problem
 *     tags: [Submissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: problemId
 *         required: true
 *         schema:
 *           type: string
 *         description: Problem ID
 *     responses:
 *       200:
 *         description: Submissions fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 count:
 *                   type: integer
 *                 submissions:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Server error
 */
submissionRoutes.get("/get-submissions-by-problem-user/:problemId", authMiddleware, getSubmissionForProblemForUser);

/**
 * @swagger
 * /api/v1/submission/get-submissions-count-for-problem/{problemId}:
 *   get:
 *     summary: Get total submission count for a problem
 *     tags: [Submissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: problemId
 *         required: true
 *         schema:
 *           type: string
 *         description: Problem ID
 *     responses:
 *       200:
 *         description: Submission count fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 count:
 *                   type: integer
 *       500:
 *         description: Server error
 */
submissionRoutes.get("/get-submissions-count-for-problem/:problemId", authMiddleware, getSubmissionCountForProblem);

export default submissionRoutes;