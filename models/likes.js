const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const like_schema = new mongoose.Schema(
  {
    users: [
      {
        type: String,
        required: true,
      },
    ],

    blog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
    },
  },
  { timestamps: true }
);

const like = mongoose.model("like", like_schema);
module.exports = like;
