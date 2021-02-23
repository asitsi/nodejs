const Localcomment = require("../models/localcommentpost");
const { validationResult } = require("express-validator");

exports.createLocalcomment = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }

  const localcomment = new Localcomment(req.body);
  localcomment.save((err, localcomment) => {
    if (err) {
      return res.status(400).json({
        error: "something went wrong please try again",
      });
    }
    res.json({ localcomment });
  });
};

exports.getLocalCommentSubmit = (req, res) => {
  Localcomment.find().exec((err, data) => {
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
