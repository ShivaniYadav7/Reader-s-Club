const express = require("express");
const router = express.Router();
const multer = require("multer");
const { storage } = require("../config/cloud.config");
const upload = multer({ storage });
const { checkSafety } = require("../middleware/aiMiddleware");

const {
  createPost,
  getAllPosts,
  getPostById,
  getUploadUrl,
  assignToGroup,
  updatePost,
  deletePost,
  addComment,
} = require("../controllers/postController");

const { checkContentSafety } = require("../middleware/aiMiddleware");
const { protect } = require("../middleware/authMiddleware");

// Public Routes
router.get("/", getAllPosts);
router.get("/:id", getPostById);

// Protected Routes (Must be logged in)
router.post("/", protect, upload.single("image"), checkContentSafety, createPost);

router.patch("/:postId/group", protect, assignToGroup);

router.put("/:id", protect, upload.single("image"), updatePost);

router.delete("/:id", protect, deletePost);

router.put("/:id/comment", protect, addComment);

// Image helper
router.post("/upload", protect, upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file provided" });
  res
    .status(200)
    .json({ imageUrl: req.file.path, public_id: req.file.filename });
});

module.exports = router;