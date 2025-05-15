import { db } from "../libs/db.js";

const getAllSubmissions = async (req, res) => {
    try {
        const userId = req.user.id;

        const submissions = await db.Submission.findMany({
            where: {
                userId: userId
            }
        });

        res.status(200).json({
            success: true,
            message: "Submissions fetched successfully",
            count: submissions.length,
            submissions: submissions
        });



    } catch (error) {
        console.error("Error fetching submissions:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching submissions"
        })
    }
};

const getSubmissionForProblemForUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const problemId = req.params.problemId;

        const submissions = await db.Submission.findMany({
            where: {
                userId: userId,
                problemId: problemId
            }
        });

        res.status(200).json({
            success: true,
            message: "Submissions fetched successfully",
            count: submissions.length,
            submissions: submissions
        });
    } catch (error) {
        console.error("Error fetching submissions:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching submissions"
        })
    }
};

const getSubmissionCountForProblem = async (req, res) => {
    try {
        const problemId = req.params.problemId;

        const submissionsCount = await db.Submission.count({
            where: {
                problemId: problemId
            }
        });

        res.status(200).json({
            success: true,
            message: "Submission count fetched successfully",
            count: submissionsCount
        });
    } catch (error) {
        console.error("Error fetching submission count:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching submission count"
        })
    }
};


export {
    getAllSubmissions,
    getSubmissionForProblemForUser,
    getSubmissionCountForProblem
}