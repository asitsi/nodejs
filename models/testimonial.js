const mongoose = require("mongoose");

const testiSchema = new mongoose.Schema(
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

module.exports = mongoose.model("Testi", testiSchema);
