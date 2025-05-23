import axios from "axios";

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

const submitBatch = async (submissions) => {
    const {data} = await axios.post(`${process.env.JUDGE0_API_URL}/submissions/batch?base64_encoded=false`, {
        submissions
    })

    console.log("Submitted batch: ", data);

    return data;
};

const sleep = (seconds) => new Promise((resolve) => setTimeout(resolve, seconds*1000));

const pollBatchResults = async (tokens) => {
    while(true) {
        const {data} = await axios.get(`${process.env.JUDGE0_API_URL}/submissions/batch`, {
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

        await sleep(1);
    }
}

export {
    getJudge0LanguageId,
    submitBatch,
    pollBatchResults,
    getLanguageName
}