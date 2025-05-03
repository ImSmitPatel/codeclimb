import { UserRole } from "../generated/prisma/index.js";
import { getJudge0LanguageId, submitBatch, pollBatchResults } from "../libs/judge0.lib.js";
import { db } from "../libs/db.js";

const createProblem = async (req, res) => {
    const {
        title, 
        description, 
        difficulty, 
        tags, 
        examples, 
        constraints, 
        testcases, 
        codeSnippets, 
        referenceSolutions
    } = req.body

    if(req.user.role !== UserRole.ADMIN){
        return res.status(403).json({
            success: false,
            message: "Forbidden Access - User not allowed to create problems"
        })
    }

    try {
        for(const [language, solutionCode] of Object.entries(referenceSolutions)){
            const languageId = getJudge0LanguageId(language);

            if(!languageId){
                console.error(`Invalid language: ${language}`);
                return res.status(400).json({
                    success: false,
                    message: `Invalid language: ${language}`
                })
            }

            console.log(`Submitting ${testcases.length} testcases for language ${language}`);

            const submissions = testcases.map(({input, output}) => ({
                source_code: solutionCode,
                language_id: languageId,
                stdin: input,
                expected_output: output,
            }))

            const submissionResult = await submitBatch(submissions)

            const tokens = submissionResult.map((res) => res.token);

            const results = await pollBatchResults(tokens);

            for( let i = 0; i < results.length; i++) {
                const result = results[i];

                console.log(`\n[${language}] Testcase ${i + 1} result: ${JSON.stringify(result.status.description)}`);

                if(result.status.id !== 3) {
                    return res.status(400).json({
                        error: `Testcase ${i + 1} failed for language ${language}`,
                    });
                }
            }
        }

        const newProblem = await db.Problem.create({
            data: {
                title,
                description,
                difficulty,
                tags,
                examples,
                constraints,
                testcases,
                codeSnippets,
                referenceSolutions,
                userId: req.user.id
            },
        });

        return res.status(201).json({
            success: true,
            message: "New Problem Created Successfully",
            data: newProblem
        })

    } catch (error) {
        console.error("Error creating problem:", error);
        return res.status(500).json({
            success: false,
            message: "Error creating problem"
        })
    }
};

const getAllProblems = async (req, res) => {

    try {
        const problems = await db.Problem.findMany();

        if (!problems) {
            return res.status(404).json({
                success : false,
                message: "No problems found"
            })
        }

        res.status(200).json({
            success : true,
            message: "Problems fetched successfully",
            data: problems
        });

    } catch (error) {
        console.error("Error fetching problems:", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching problems"
        })
    }
};

const getProblemById = async (req, res) => {
    const {id} = req.params;

    try {
        const problem = await db.Problem.findUnique({
            where: {
                id
            }
        });

        if (!problem) {
            return res.status(404).json({
                success: false,
                message: `Problem with id ${id} not found`
            })
        }

        return res.status(200).json({
            success: true,
            message: `Problem with id ${id} fetched successfully`,
            data: problem
        })
    } catch (error) {
        console.error(`Error fetching problem with id ${id}: \n`, error);
        return res.status(500).json({
            success: false,
            message: "Error fetching problem by id"
        })
    }
};

const updateProblemById = async (req, res) => {
    const {id} = req.params;

    if (req.user.role !== UserRole.ADMIN) {
        return res.status(403).json({
            success: false,
            message: "Forbidden Access - User not allowed to update problems"
        })
    }

    try {
        const existingProblem = await db.Problem.findUnique({where: {id}});

        if (!existingProblem){
            return res.status(404).json({
                success: false,
                message: `Problem with id ${id} not found`
            })
        }

        const {
            title, 
            description, 
            difficulty, 
            tags, 
            examples, 
            constraints, 
            testcases, 
            codeSnippets, 
            referenceSolutions
        } = req.body

        for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
            const languageId = getJudge0LanguageId(language);

            if (!languageId) {
                return res.status(400).json({
                    success: false,
                    message: `Invalid language: ${language}`
                });
            }

            const submissions = testcases.map(({ input, output }) => ({
                source_code: solutionCode,
                language_id: languageId,
                stdin: input,
                expected_output: output,
            }));

            const submissionResult = await submitBatch(submissions);
            const tokens = submissionResult.map((res) => res.token);
            const results = await pollBatchResults(tokens);

            for (let i = 0; i < results.length; i++) {
                const result = results[i];
                console.log(`\n[${language}] Testcase ${i + 1} result: ${result.status.description}`);

                if (result.status.id !== 3) {
                    return res.status(400).json({
                        success: false,
                        message: `Testcase ${i + 1} failed for language ${language}`,
                        result,
                    });
                }
            }
        }

        const updatedProblem = await db.Problem.update({
            where: {id},
            data: {
                title,
                description,
                difficulty,
                tags,
                examples,
                constraints,
                testcases,
                codeSnippets,
                referenceSolutions
            }
        });

        
        return res.status(200).json({
            success: true,
            message: `Problem with id ${id} updated successfully`,
            data: updatedProblem
        })

    } catch (error) {
        console.error(`Error updating problem with id ${id}: \n`, error);
        return res.status(500).json({
            success: false,
            message: "Error updating problem by id"
        })
    }
};

const deleteProblemById = async (req, res) => {
    const {id} = req.params;

    if (req.user.role !== UserRole.ADMIN) {
        return res.status(403).json({
            success: false,
            message: "Forbidden Access - User not allowed to delete problem"
        })
    }

    try {
        const problem = await db.Problem.findUnique({where: {id}});

        if (!problem) {
            return res.status(404).json({
                success: false,
                message: `Problem with id ${id} not found`
            })
        }

        await db.Problem.delete({where: {id}});

        return res.status(200).json({
            success: true,
            message: `Problem with id ${id} deleted successfully`,
        })
    } catch (error) {
        console.error(`Error deleting problem with id ${id}: \n`, error);
        return res.status(500).json({
            success: false,
            message: "Error deleting problem by id"
        })
    }
};

const getAllProblemsSolvedByUser = async (req, res) => {};

export { 
    createProblem,
    getAllProblems,
    getProblemById,
    updateProblemById,
    deleteProblemById,
    getAllProblemsSolvedByUser
}