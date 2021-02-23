const mongoose = require("mongoose");

const facultySchema = new mongoose.Schema(
  {
    photo: {
      data: Buffer,
      contentTyle: String,
    },
    name: {
      type: String,
      trim: true,
      required: true,
    },
    skill: {
      type: String,
      trim: true,
      required: true,
    },
    qualification: {
      type: String,
      trim: true,
      required: true,
    },
    achievement: {
      type: String,
      trim: true,
    },
    createDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Faculty", facultySchema);
