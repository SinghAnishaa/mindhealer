const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini AI with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function getChatResponse(message) {
    try {
        // Use the standard gemini-pro model
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `You are MindHealer, an empathetic mental health chatbot. 
        Respond to the following message in a supportive and helpful way: ${message}`;

        console.log("🔍 Sending prompt to Gemini API:", prompt);

        const result = await model.generateContent(prompt);
        const response = await result.response;

        if (!response) {
            console.error("❌ Invalid response from Gemini API:", result);
            return { error: "Invalid response from Gemini API" };
        }

        const text = response.text();
        console.log("✅ Gemini API Response:", text);

        return { response: text };
    } catch (error) {
        console.error("❌ Gemini API Error:", error.message);
        return { error: "Failed to get response from Gemini API" };
    }
}

module.exports = { getChatResponse };
