const Post = require("../models/Post");
const Group = require("../models/Group"); 

const createPost = async (req, res) => {
  try {
    const { title, content, groupId, imageUrl: bodyImageUrl } = req.body;
    const imageUrl = bodyImageUrl || (req.file && req.file.path);

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    // Check Group Membership
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
        .populate("group", "name")  
        .populate({
            path: "comments",        
            populate: {
              path: "postedBy", 
              select: "name"         
            }
        });

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

// Update Post
const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    const post = await Post.findById(id);

    if(!post) {
      return res.status(404).json({ message: "Post not found "});
    }

    // AUTHORIZATION CHECK: Is the logged-in user the author?
      // We compare the IDs
    if(post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({message: "Not authorized to edit this post"});
    }

    // Update fields
    post.title = title || post.title;
    post.content = content || post.content;

    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({message: "Server error", error:error.message});
  }
};

// Delet Post
const deletePost = async (req, res) => {
  try {
    const {id } = req.params;
    const post = await Post.findById(id).populate('group');

    if(!post) {
      return res.status(404).json({message: "Post not found"});
    }

    // Defining permissions
    const userId = req.user._id.toString();
    const isAuthor = post.author.toString() === userId;

    // Checking if post belongs  to a group AND if the user is that group's creator
    const isGroupOwner = post.group && post.group.creator.toString() === userId;

    // Allow if Author OR GroupOwner
    if(!isAuthor && !isGroupOwner) {
      return res.status(403).json({ message: "Not authorized to delete this post"});
    }

    await post.deleteOne();
    res.json({ message: "Post removed"});
    
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message});
  }
};

// To comment on a post
const addComment = async (req, res) => {
  try {
    const {id } = req.params;
    const comment = {
      text: req.body.text,
      postedBy: req.user._id
    };

    const post = await Post.findByIdAndUpdate(
      id,
      { $push: { comments: comment }},
      { new: true}
    ).populate("comments.postedBy", "name");

    if(!post) return res.status(404).json({ message: "Post not found"});

    const newComment = post.comments[post.comments.length - 1];

    console.log(`EMITTING TO room: ${id}`);
    // Real-Time sockets: Emit only to people looking at this specific post
    req.io.to(id).emit("new_comment", newComment);

    res.json(newComment);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};

// Get all posts belonging to a specific group
const getPostsByGroup = async (req, res) => {
  try {
    const { id } = req.params; 
    const posts = await Post.find({ group: id })
      .populate("author", "name")
      .sort({ createdAt: -1 });
    
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = {
  getAllPosts,
  createPost,
  getPostById,
  assignToGroup,
  updatePost,
  deletePost,
  addComment,
  getPostsByGroup,
};