import express from 'express';
import {authMiddleware} from '../middleware/auth.middleware.js';
import { executeCode } from '../controllers/execution.controller.js';

const executionRoutes = express.Router();

/**
 * @swagger
 * tags:
 *   name: Code Execution
 *   description: API for executing code in a secure environment
 */


/**
 * @swagger
 * /execution:
 *   post:
 *     summary: Execute submitted code against test cases
 *     tags: [Code Execution]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - source_code
 *               - language_id
 *               - stdin
 *               - expected_outputs
 *               - problemId
 *             properties:
 *               source_code:
 *                 type: string
 *                 description: Source code to be executed
 *                 example: |
 *                   const fs = require('fs');
 *                   const input = fs.readFileSync(0, 'utf-8').trim();
 *                   const [a, b] = input.split(' ').map(Number);
 *                   console.log(a + b);
 *               language_id:
 *                 type: integer
 *                 description: ID representing the programming language (e.g., 63 for JavaScript)
 *                 example: 63
 *               stdin:
 *                 type: array
 *                 description: List of standard input strings
 *                 items:
 *                   type: string
 *                 example: ["100 200", "-500 -600", "0 0"]
 *               expected_outputs:
 *                 type: array
 *                 description: Expected outputs for each input case
 *                 items:
 *                   type: string
 *                 example: ["300", "-1100", "0"]
 *               problemId:
 *                 type: string
 *                 format: uuid
 *                 description: UUID of the problem being solved
 *                 example: 57559756-436c-4be7-8d13-b7ae8159f6b3
 *     responses:
 *       200:
 *         description: Execution results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 results:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       input:
 *                         type: string
 *                         example: "100 200"
 *                       output:
 *                         type: string
 *                         example: "300"
 *                       expected:
 *                         type: string
 *                         example: "300"
 *                       passed:
 *                         type: boolean
 *                         example: true
 *       400:
 *         description: Bad request – Invalid input data
 *       401:
 *         description: Unauthorized – Missing or invalid token
 *       500:
 *         description: Internal server error
 */


executionRoutes.post("/", authMiddleware, executeCode);

export default executionRoutes;