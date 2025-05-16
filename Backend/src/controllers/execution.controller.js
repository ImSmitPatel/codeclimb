import { pollBatchResults, submitBatch, getLanguageName } from '../libs/judge0.lib.js'
import {db} from "../libs/db.js";

const executeCode = async (req, res) => {
    try {
        const {
            source_code, language_id, stdin, expected_outputs, problemId
        } = req.body;

        const userId = req.user.id;

        // valid testcases
        if (!Array.isArray(stdin) || stdin.length === 0 || !Array.isArray(expected_outputs) || expected_outputs.length !== stdin.length) {
            return res.status(400).json({
                success: false,
                message: "Invalid or missing testcases"
            })
        }

        // prepare testcases for judge0 submissions
        const submissions = stdin.map((input) => ({
            source_code,
            language_id,
            stdin: input,
        }))

        // Send submissions batch to judge0
        const submitResponse = await submitBatch(submissions)

        const tokens = submitResponse.map((response) => response.token);

        // Poll judge0 for results of all submitted testcases
        const results = await pollBatchResults(tokens);

        console.log('Result ----------');
        console.log(results)

        // check if all testcases passed
        let isAllTestcasesPassed = true;

        const detailedResults = results.map((result, index) => {
            const stdout = result.stdout?.trim();
            const expected_output = expected_outputs[index]?.trim();
            const passed = stdout === expected_output;

            if(!passed) isAllTestcasesPassed = false;

            return {
                testCase: index+1,
                passed,
                stdout,
                expected: expected_output,
                stderr: result.stderr,
                compileOutput: result.compile_output,
                status: result.status.description,
                memory: result.memory? `${result.memory} KB` : undefined,
                time: result.time? `${result.time} sec` : undefined,
            }
        })

        console.log(detailedResults)

        // store submission summary in db
        const submission = await db.Submission.create({
            data: {
                userId,
                problemId,
                sourceCode: source_code,
                language: getLanguageName(language_id),
                stdin: stdin.join("\n"),
                stdout: JSON.stringify(detailedResults.map((r) => r.stdout)),
                stderr: detailedResults.some((r) => r.stderr)? JSON.stringify(detailedResults.map((r) => r.stderr)) : null,
                compileOutput: detailedResults.some((r) => r.compileOutput)? JSON.stringify(detailedResults.map((r) => r.compileOutput)) : null,
                status: isAllTestcasesPassed? "Accepted" : "Wrong Answer",
                memory: detailedResults.some((r) => r.memory)? JSON.stringify(detailedResults.map((r) => r.memory)) : null,
                time: detailedResults.some((r) => r.time)? JSON.stringify(detailedResults.map((r) => r.time)) : null,
            }
        })

        // If All passed => mark problem as solved for User
        if(isAllTestcasesPassed){
            await db.ProblemSolved.upsert({
                where: {
                    userId_problemId: {
                        userId, problemId
                    }
                },
                update: {},
                create: {
                    userId, problemId
                }
            })
        }

        // Save Individual testcase results

        const testCaseResults = detailedResults.map((result) => ({
            submissionId: submission.id,
            testCase: result.testCase,
            passed: result.passed,
            stdout: result.stdout,
            expected: result.expected,
            stderr: result.stderr,
            compileOutput: result.compileOutput,
            status: result.status,
            memory: result.memory,
            time: result.time,
        }))

        await db.TestCaseResult.createMany({
            data: testCaseResults
        })

        const submissionWithTestCase = await db.Submission.findUnique({
            where: {
                id: submission.id
            },
            include: {
                testCases: true
            }
        })

        return res.status(200).json({
            success: true,
            message: "Code Executed Successfully!",
            submission: submissionWithTestCase
        })
    } catch (error) {
        console.error("Error executing code:", error);
        return res.status(500).json({
            success: false,
            message: "Code Execution Failed!"
        })
    }
}

export {
    executeCode
}