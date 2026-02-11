const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  text: {type: String, required: true},
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
  created: { type: Date, default: Date.now}
});

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    imageUrl: {
      type: String,
      required: false,
    },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
    },
    comments: [commentSchema]
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
