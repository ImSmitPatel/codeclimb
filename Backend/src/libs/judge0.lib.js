import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const JUDGE0_API_URL = process.env.JUDGE0_API_URL;
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = process.env.RAPIDAPI_HOST;

const getJudge0LanguageId = (language) => {
    const languageMap = {
        "PYTHON": 71,
        "JAVA": 62,
        "JAVASCRIPT": 63,
    };

    return languageMap[language.toUpperCase()] || null;
}

const getLanguageName = (languageId) => {
    const languageMap = {
        71: "PYTHON",
        62: "JAVA",
        63: "JAVASCRIPT",
    };

    return languageMap[languageId] || "UNKNOWN";

}

const judgeClient = axios.create({
  baseURL: JUDGE0_API_URL,
  headers: {
    "Content-Type": "application/json",
    "X-RapidAPI-Key": RAPIDAPI_KEY,
    "X-RapidAPI-Host": RAPIDAPI_HOST,
  },
  timeout: 15000, // prevent hanging forever
});

const submitBatch = async (submissions) => {
    const {data} = await judgeClient.post("/submissions/batch?base64_encoded=false", {
        submissions,
    })

    return data;
};

const sleep = (seconds) => new Promise((resolve) => setTimeout(resolve, seconds*1000));

const pollBatchResults = async (tokens) => {

    const maxAttempts = 20; // prevent infinite loop
    let attempts = 0;

    while (attempts < maxAttempts) {
        const {data} = await judgeClient.get("/submissions/batch", {
            params: {
                tokens: tokens.join(","),
                base64_encoded: false,
            }
        });

        const results = data.submissions;

        const isAllDone = results.every(
            (result) => result.status.id >= 3
        );

        if(isAllDone) return results

        attempts++;
        await sleep(1);
    }
    throw new Error("Judge0 polling timeout");
};

export {
    getJudge0LanguageId,
    submitBatch,
    pollBatchResults,
    getLanguageName
}