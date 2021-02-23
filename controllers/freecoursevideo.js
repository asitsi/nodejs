const Freecoursevideo = require("../models/freecoursevideo");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");

exports.getFreecoursevideoById = (req, res, next, id) => {
  Freecoursevideo.findById(id)
    .populate("category")
    .exec((err, freecoursevideo) => {
      if (err) {
        return res.status(400).json({
          error: "Freecoursevideo not found",
        });
      }
      req.freecoursevideo = freecoursevideo;
      next();
    });
};

exports.createFreecoursevideo = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "problem with image",
      });
    }
    //destructure the fields
    const { name, description } = fields;

    if (!name || !description) {
      return res.status(400).json({
        error: "Please include all fields",
      });
    }

    let freecoursevideo = new Freecoursevideo(fields);

    //handle file here
    if (file.video) {
      if (file.video.size > 10e9) {
        return res.status(400).json({
          error: "File size too big!",
        });
      }
      freecoursevideo.video.data = fs.readFileSync(file.video.path);
      freecoursevideo.video.contentType = file.video.type;
    }
    // console.log(freecoursevideo);

    //save to the DB
    freecoursevideo.save((err, freecoursevideo) => {
      if (err) {
        res.status(400).json({
          error: "Saving tshirt in DB failed",
        });
      }
      res.json(freecoursevideo);
    });
  });
};

exports.getFreecoursevideo = (req, res) => {
  req.freecoursevideo.video = undefined;
  return res.json(req.freecoursevideo);
};

//middleware
exports.video = (req, res, next) => {
  if (req.freecoursevideo.video.data) {
    res.set("Content-Type", req.freecoursevideo.video.contentType);
    return res.send(req.freecoursevideo.video.data);
  }
  next();
};

// delete controllers
exports.deleteFreecoursevideo = (req, res) => {
  let freecoursevideo = req.freecoursevideo;
  freecoursevideo.remove((err, deletedFreecoursevideo) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to delete the Freecoursevideo",
      });
    }
    res.json({
      message: "Deletion was a success",
      deletedFreecoursevideo,
    });
  });
};

// PUT controllers
exports.updateFreecoursevideo = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "problem with image",
      });
    }

    //updation code
    let freecoursevideo = req.freecoursevideo;
    freecoursevideo = _.extend(freecoursevideo, fields);

    //handle file here
    if (file.video) {
      if (file.video.size > 10000000) {
        return res.status(400).json({
          error: "File size too big!",
        });
      }
      freecoursevideo.video.data = fs.readFileSync(file.video.path);
      freecoursevideo.video.contentType = file.video.type;
    }
    // console.log(freecoursevideo);

    //save to the DB
    freecoursevideo.save((err, freecoursevideo) => {
      if (err) {
        res.status(400).json({
          error: "Updation of freecoursevideo failed",
        });
      }
      res.json(freecoursevideo);
    });
  });
};

//freecoursevideo listing

exports.getAllFreecoursevideos = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 8;
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  const freecoursevideo = Freecoursevideo;
  freecoursevideo
    .find()
    .select("-video")
    .populate("category")
    .sort([[sortBy, "asc"]])
    .limit(limit)
    .exec((err, freecoursevideos) => {
      if (err) {
        return res.status(400).json({
          error: "NO freecoursevideo FOUND",
        });
      }
      res.json(freecoursevideos);
    });
};

exports.getAllUniqueCategories = (req, res) => {
  Freecoursevideo.distinct("category", {}, (err, category) => {
    if (err) {
      return res.status(400).json({
        error: "NO category found",
      });
    }
    res.json(category);
  });
};

exports.updateStock = (req, res, next) => {
  let myOperations = req.body.order.freecoursevideos.map((prod) => {
    return {
      updateOne: {
        filter: { _id: prod._id },
        update: { $inc: { stock: -prod.count, sold: +prod.count } },
      },
    };
  });

  Freecoursevideo.bulkWrite(myOperations, {}, (err, freecoursevideos) => {
    if (err) {
      return res.status(400).json({
        error: "Bulk operation failed",
      });
    }
    next();
  });
};
