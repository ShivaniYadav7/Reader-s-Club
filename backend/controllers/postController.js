const Post = require("../models/Post");
const Group = require("../models/Group"); // Import Group model

const createPost = async (req, res) => {
  try {
    const { title, content, groupId, imageUrl: bodyImageUrl } = req.body;
    const imageUrl = bodyImageUrl || (req.file && req.file.path);

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    // --- FIX: Check Group Membership ---
    if (groupId) {
      const group = await Group.findById(groupId);
      if (!group) {
        return res.status(404).json({ message: "Group not found" });
      }

      // Check if user is a member (String comparison)
      const isMember = group.members.some(
        (id) => id.toString() === req.user._id.toString()
      );

      if (!isMember) {
        return res.status(403).json({ message: "You must be a member to post in this group" });
      }
    }
    // -----------------------------------

    const newPostData = {
      title,
      content,
      imageUrl,
      author: req.user._id,
      group: groupId || undefined, 
    };

    const post = await Post.create(newPostData);
    res.status(201).json(post);
  } catch (error) {
    console.error("Create Post Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({})
      .populate("author", "name")
      .populate("group", "name") 
      .sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts", error: error.message });
  }
};

const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
        .populate("author", "name")
        .populate("group", "name");
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "Post not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const assignToGroup = async (req, res) => {

    try {
        const { postId } = req.params;
        const { groupId } = req.body;
    
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: "Post not found" });
        
        // Check ownership
        if (post.author.toString() !== req.user._id.toString()) {
          return res.status(403).json({ message: "Not authorized" });
        }
    
        post.group = groupId;
        await post.save();
    
        res.json(post);
      } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
      }
};

module.exports = {
  getAllPosts,
  createPost,
  getPostById,
  assignToGroup,
};