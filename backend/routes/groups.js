const express = require("express");
const router = express.Router();
const multer = require("multer");
const { storage } = require("../config/cloud.config"); 
const upload = multer({ storage });
const { protect } = require("../middleware/authMiddleware");
const { 
    createGroup, 
    getAllGroups, 
    getGroupById,
    joinGroup,
    leaveGroup,
    deleteGroup 
} = require("../controllers/groupController");

router.post("/", protect, upload.single("image"), createGroup);

router.get("/", getAllGroups);
router.get("/:id", getGroupById);
router.get("/:id/posts", require("../controllers/postController").getPostsByGroup); 

router.post("/:id/join", protect, joinGroup);
router.post("/:id/leave", protect, leaveGroup);

router.delete("/:id", protect, deleteGroup); 

module.exports = router;