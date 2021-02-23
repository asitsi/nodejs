const mongoose = require("mongoose");

const freevideocourseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      required: false,
      trim: true,
    },
    video: {
      data: Buffer,
      contentTyle: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Freecoursevideo", freevideocourseSchema);
