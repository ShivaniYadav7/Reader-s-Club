const Group = require("../models/Group");
const User = require("../models/User");
const Post = require("../models/Post");
const mongoose = require("mongoose");

const createGroup = async (req, res) => {
  try {
    const { name, description, theme, imageUrl } = req.body;

    if (!name || !description) {
      return res.status(400).json({ message: "Name and description are required" });
    }

    const group = await Group.create({
      name,
      description,
      theme: theme || "General",
      imageUrl: imageUrl || "",
      creator: req.user._id,
      members: [req.user._id],
    });

    await User.findByIdAndUpdate(req.user._id, {
      $push: { groups: group._id },
    });

    res.status(201).json(group);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getAllGroups = async (req, res) => {
  try {
    const groups = await Group.find({})
      .populate("creator", "name")
      .sort({ createdAt: -1 });
    res.status(200).json(groups);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const joinGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    const user = await User.findById(req.user._id);

    if (!group) return res.status(404).json({ message: "Group not found" });

    const isMember = group.members.some(
      (memberId) => memberId.toString() === req.user._id.toString()
    );

    if (isMember) {
      return res.status(400).json({ message: "User is already a member" });
    }

    group.members.push(req.user._id);
    await group.save();

    user.groups.push(group._id);
    await user.save();

    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const leaveGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    const user = await User.findById(req.user._id);

    if (!group) return res.status(404).json({ message: "Group not found" });

    const isMember = group.members.some(
        (memberId) => memberId.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(400).json({ message: "User is not a member of this group" });
    }

    group.members = group.members.filter(
        (memberId) => memberId.toString() !== req.user._id.toString()
    );
    await group.save();

    user.groups = user.groups.filter(
        (groupId) => groupId.toString() !== group._id.toString()
    );
    await user.save();

    res.status(200).json({ message: "Successfully left the group" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const getGroupById = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate("creator", "name")
      .populate("members", "name _id"); 

    if (!group) return res.status(404).json({ message: "Group not found" });
    
    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const getGroupPosts = async (req, res) => {
  try {
    const posts = await Post.find({ group: req.params.id })
      .populate("author", "name")
      .sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const deleteGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const group = await Group.findById(id);

    if (!group) return res.status(404).json({ message: "Group not found" });

    if (group.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this group" });
    }

    // Cascade delete posts
    await Post.deleteMany({ group: id });
    await group.deleteOne();

    res.json({ message: "Group deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { 
  createGroup, 
  getAllGroups, 
  getGroupById, 
  joinGroup, 
  leaveGroup, 
  deleteGroup
};