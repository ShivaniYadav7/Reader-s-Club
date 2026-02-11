const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const checkContentSafety = async (req, res, next) => {
  try {
    const { content, title } = req.body;
    
    const textToCheck = `Title: ${title || ""}. Content: ${content || ""}`;

    // Skip check if empty (Let controller handle validation)
    if (!textToCheck.trim()) return next();

    console.log("[AI SAFETY] Checking post...");

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Analyze this text for: Hate Speech, Harassment, Gibberish/Spam, or Spoilers.
      Text: "${textToCheck}"
      
      Respond ONLY with this JSON:
      { "isSafe": boolean, "reason": "Short explanation" }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    // Clean up the text 
    let text = response.text().replace(/```json|```/g, "").trim();

    // SAFE PARSING START 
    let analysis;
    try {
      analysis = JSON.parse(text);
    } catch (e) {
      console.error("AI returned invalid JSON:", text);
      // Fail Open: If AI acts weird, let the post through
      return next(); 
    }
    // --- SAFE PARSING END ---

    if (analysis.isSafe === false) {
      console.log(`[AI BLOCK] ${analysis.reason}`);
      return res.status(400).json({ 
        message: `Post blocked: ${analysis.reason}` 
      });
    }

    next(); 

  } catch (error) {
    console.error("[AI ERROR] System Error:", error.message);
    // Important: Don't crash the request. Send a 500 error.
    return res.status(500).json({ 
      message: "Safety check service is temporarily unavailable." 
    });
  }
};

module.exports = { checkContentSafety };