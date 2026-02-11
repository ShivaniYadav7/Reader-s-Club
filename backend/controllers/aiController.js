const { GoogleGenerativeAI } = require("@google/generative-ai");
const Post = require("../models/Post");
const Group = require("../models/Group");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getBookRecommendations = async (req, res) => {
  console.log("AI Recommendation Request Started...");

  try {
    const userId = req.user._id;
    
    const groups = await Group.find({ members: userId }).select("name");
    const posts = await Post.find({ author: userId }).limit(3).select("title");
    
    const context = `Groups: ${groups.map(g=>g.name).join(", ")}, Posts: ${posts.map(p=>p.title).join(", ")}`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Based on this user context: "${context}", suggest 3 books.
      Respond ONLY with a valid JSON list:
      [ { "title": "Book Name", "author": "Author", "reason": "Short reason" } ]
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().replace(/```json|```/g, "").trim();

    console.log("AI Success:", text);
    res.json(JSON.parse(text));

  } catch (error) {
    console.error("AI ERROR:", error);
    // Fallback: If AI fails, sending hardcoded data so the app doesn't crash
    res.json([
      { title: "The Pragmatic Programmer", author: "Andy Hunt", reason: "Fallback recommendation for developers." },
      { title: "Clean Code", author: "Robert C. Martin", reason: "Classic fallback book." },
      { title: "Atomic Habits", author: "James Clear", reason: "Good for everyone." }
    ]);
  }
};

module.exports = { getBookRecommendations };