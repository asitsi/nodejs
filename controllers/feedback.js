const Feedbackmodule = require("../models/feedback");
const { validationResult } = require("express-validator");

exports.createfeedback = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }

  const feedback = new Feedbackmodule(req.body);
  feedback.save((err, feedback) => {
    if (err) {
      return res.status(400).json({
        error: "something went wrong please try again",
      });
    }
    res.json({ feedback });
  });
};

exports.getcreatedfeedback = (req, res) => {
  Feedbackmodule.find().exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: "NO product FOUND",
      });
    }
    res.json(data);
    // console.log(data);
  });

  //   res.send(localcomment);
  //   res.json({ localcomment });
};
