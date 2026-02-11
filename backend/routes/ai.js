const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { getBookRecommendations } = require("../controllers/aiController");

router.get("/recommendations", protect, getBookRecommendations);

module.exports = router;