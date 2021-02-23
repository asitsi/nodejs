exports.getQuizById = (req, res, next, id) => {
  testmodel
    .findById(id)
    .populate("category")
    .exec((err, quiz) => {
      if (err) {
        return res.status(400).json({
          error: "quiz not found",
        });
      }
      req.quiz = quiz;
      next();
    });
};
