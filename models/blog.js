const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      required: true,
    },
    tags: {
      type: [String],
      required: false,
    },
    createDate: {
      type: Date,
      required: false,
      default: Date.now,
    },
    photo: {
      data: Buffer,
      contentTyle: String,
    },
    comment: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);
