import { pollBatchResults, submitBatch } from '../libs/judge0.lib.js'

const executeCode = async (req, res) => {
    try {
        const {
            source_code, language_id, stdin, expected_outputs, problemId
        } = req.body;

        const userId = req.user.id;

        // valid testcases
        if (
            !Array.isArray(stdin) ||
            stdin.length === 0 ||
            !Array.isArray(expected_outputs) ||
            expected_outputs.length !== stdin.length
        ) {
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

        return res.status(200).json({
            success: true,
            message: "Code Exected Successfully!"
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