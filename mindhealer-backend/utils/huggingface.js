const fetch = require("node-fetch");

const fetchWithRetry = async (url, options, retries = 3, delay = 2000) => {
    for (let attempt = 0; attempt < retries; attempt++) {
        try {
            const response = await fetch(url, options);
            const data = await response.json();
            
            if (data.error && data.error_type === "overloaded") {
                console.warn(`⚠️ Hugging Face API overloaded. Retrying in ${delay}ms...`);
                await new Promise((resolve) => setTimeout(resolve, delay));
                delay *= 2; // Exponential backoff
                continue;
            }
            
            return data;
        } catch (error) {
            console.error("❌ API request failed:", error);
        }
    }
    return { error: "Hugging Face API is currently overloaded. Try again later." };
};

module.exports = { fetchWithRetry };
