const express = require("express");
const router = express.Router();

const {
  createGroup,
  getAllGroups,
  joinGroup,
  leaveGroup,
  getGroupById,
  getGroupPosts,
} = require("../controllers/groupController");

const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createGroup);
router.get("/", getAllGroups);
router.post("/:id/join", protect, joinGroup);
router.post("/:id/leave", protect, leaveGroup);
router.get("/:id", getGroupById);
router.get("/:id/posts", getGroupPosts);

module.exports = router;
