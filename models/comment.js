const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const comment_schema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: "Somthing went worng",
    },
    blog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", comment_schema);
module.exports = Comment;
