const CA = require("../models/currentaffears");

/////   Post Current Affears /////
exports.CAPost = (req, res, next) => {
  const Post = new CA(req.body);
  Post.save((err, post) => {
    if (err) {
      return res.status(400).json({
        error: "Something went worng ...! please try Again",
      });
    }
    res.json({ post });
  });
};

/////   Get Current Affears /////
exports.getCA = (req, res) => {
  CA.find()
    .populate("cacategory")
    .exec((err, data) => {
      if (err) {
        return res.status(400).json({
          error: "Not Found",
        });
      }
      res.json(data);
    });
};

/////  Delete Current Affears /////
exports.deleteCA = async (req, res, next) => {
  try {
    const { CAId } = req.params;
    // console.log(CAId);
    const CAs = await CA.findById(CAId);
    if (!CAs) {
      throw new Error("no CAs found");
    } else {
      await CAs.remove();
      res.status(202).json({
        error: "deleted successfully",
      });
    }
  } catch (error) {
    res.status = 400;
    next(error);
  }
};

/////   Update Current Affears /////
exports.putCA = async (req, res) => {
  const { CAId } = req.params;
  const CAs = CA.findById(CAId);
  await CAs.updateOne(req.body, (err, data) => {
    if (err) {
      return req.status(422).json({
        error: " not saved",
      });
    }
  });
};

exports.getAllUniqueCategories = (req, res) => {
  Product.distinct("cacategory", {}, (err, cacategory) => {
    if (err) {
      return res.status(400).json({
        error: "NO cacategory found",
      });
    }
    res.json(cacategory);
  });
};
