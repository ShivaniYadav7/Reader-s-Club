require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const getGenAI = () => {
  if (!process.env.GEMINI_API_KEY) return null;
  return new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
};

const checkContentSafety = async (req, res, next) => {
  try {
    const genAI = getGenAI();
    if (!genAI) {
      console.log("No API Key. Skipping AI Check.");
      return next();
    }

    const { content, title } = req.body;
    const textToCheck = `Title: ${title || ""}. Content: ${content || ""}`;

    if (!textToCheck.trim()) return next();

    console.log("Checking post...");

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
      Analyze this text for: Hate Speech, Harassment, Gibberish/Spam, or Spoilers.
      Text: "${textToCheck}"
      
      Respond ONLY with this JSON:
      { "isSafe": boolean, "reason": "Short explanation" }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().replace(/```json|```/g, "").trim();

    let analysis;
    try {
      analysis = JSON.parse(text);
    } catch (e) {
      console.error("AI returned invalid JSON. Skipping check.");
      return next(); 
    }

    if (analysis.isSafe === false) {
      console.log(`${analysis.reason}`);
      return res.status(400).json({ message: `Post blocked: ${analysis.reason}` });
    }

    console.log("Post approved.");
    next(); 

  } catch (error) {
    // 3. IF ANYTHING FAILS (404, 500, Network), ALLOW THE POST
    console.error("[AI ERROR] Check Failed (Skipping):", error.message);
    next(); 
  }
};

module.exports = { checkContentSafety };