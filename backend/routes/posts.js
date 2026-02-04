const express = require("express");
const router = express.Router();
const multer = require("multer");
const { storage } = require("../config/cloud.config");
const upload = multer({ storage });

const {
  createPost,
  getAllPosts,
  getPostById,
  getUploadUrl,
  assignToGroup,
} = require("../controllers/postController");

const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, upload.single("image"), createPost);
router.get("/", getAllPosts);
router.get("/:id", getPostById);
router.post("/:postId/assign", protect, assignToGroup);
router.patch("/:postId/group", protect, assignToGroup);

router.post("/upload", protect, upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file provided" });
  res
    .status(200)
    .json({ imageUrl: req.file.path, public_id: req.file.filename });
});

module.exports = router;
