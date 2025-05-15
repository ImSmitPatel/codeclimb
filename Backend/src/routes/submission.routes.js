import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { getAllSubmissions, getSubmissionCountForProblem, getSubmissionForProblemForUser } from '../controllers/submission.controller.js';

const submissionRoutes = express.Router();

submissionRoutes.get("/get-all-submissions", authMiddleware, getAllSubmissions);
submissionRoutes.get("/get-submissions-by-problem-user/:problemId", authMiddleware, getSubmissionForProblemForUser);
submissionRoutes.get("/get-submissions-count-for-problem/:problemId", authMiddleware, getSubmissionCountForProblem);

export default submissionRoutes;