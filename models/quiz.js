const mongoose = require("mongoose");

var quizchema = new mongoose.Schema({
  quesno: Number,
  question: String,
  options: [
    { answer: String },
    { answer: String },
    { answer: String },
    { answer: String },
  ],
  selected: Number,
  correct: Number,
  correctflag: Boolean,
});
var quizmodel = mongoose.model("quizmodels", quizchema);

module.exports = quizmodel;
