const mongoose = require("mongoose");

const ctetSchema = new mongoose.Schema(
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

module.exports = mongoose.model("Ctet", ctetSchema);
