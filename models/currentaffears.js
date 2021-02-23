const { trim } = require("lodash");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const CASchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: "Somthing went worng",
      trim: true,
    },
    option1: {
      type: String,
      required: true,
      trim: true,
    },
    option2: {
      type: String,

      trim: true,
    },
    option3: {
      type: String,

      trim: true,
    },
    option4: {
      type: String,

      trim: true,
    },

    answer: {
      type: String,
      required: true,
      trim: true,
    },
    Explanaton: {
      type: String,
    },
  },
  { timestamps: true }
);

const CA = mongoose.model("CA", CASchema);
module.exports = CA;
