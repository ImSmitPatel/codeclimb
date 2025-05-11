import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { getAllSubmissions, getSubmissionCountForProblem, getSubmissionForProblem } from '../controllers/submission.controller.js';

const submissionRoutes = express.Router();

submissionRoutes.get("/get-all-submissions", authMiddleware, getAllSubmissions);
submissionRoutes.get("/get-submissions-for-problem/:problemId", authMiddleware, getSubmissionForProblem);
submissionRoutes.get("/get-submissions-count-for-problem/:problemId", authMiddleware, getSubmissionCountForProblem);

export default submissionRoutes;