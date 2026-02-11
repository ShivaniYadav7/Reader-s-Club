require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
  try {
    const modelResponse = await genAI.getGenerativeModel({ model: "gemini-pro" });
    // There isn't a direct "list models" function in the simple client, 
    // but we can test if 'gemini-pro' works with a "Hello" prompt.
    
    console.log("Testing connection with 'gemini-pro'...");
    const result = await modelResponse.generateContent("Hello");
    const response = await result.response;
    console.log("✅ Success! You have access to: gemini-pro");
    console.log("Response:", response.text());
  } catch (error) {
    console.error("❌ Error:", error.message);
    console.log("\nTRY RUNNING: npm install @google/generative-ai@latest");
  }
}

listModels();