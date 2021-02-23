const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
    {
      title: {
        type: String,
        trim: true,
        required: true,
        maxlength: 32,
      },
      email: {
        type: String,
        trim: true,
        required: true,
      },
      description: {
        type: String,
        trim: true,
        required: true,
      }
    }, { timestamps: true }
);

module.exports = mongoose.model("Feedback", feedbackSchema )