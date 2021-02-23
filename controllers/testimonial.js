const Testi = require("../models/testimonial");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");

exports.getTestiById = (req, res, next, id) => {
  Testi.findById(id)
    .populate("category")
    .exec((err, testi) => {
      if (err) {
        return res.status(400).json({
          error: "testi not found",
        });
      }
      req.testi = testi;
      next();
    });
};

exports.createTesti = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "problem with image",
      });
    }
    //destructure the fields
    const { name, achievement } = fields;

    if (!name || !achievement) {
      return res.status(400).json({
        error: "Please include all fields",
      });
    }

    let testi = new Testi(fields);

    //handle file here
    if (file.photo) {
      if (file.photo.size > 100000000) {
        return res.status(400).json({
          error: "File size too big!",
        });
      }
      testi.photo.data = fs.readFileSync(file.photo.path);
      testi.photo.contentType = file.photo.type;
    }
    // console.log(testi);

    //save to the DB
    testi.save((err, testi) => {
      if (err) {
        res.status(400).json({
          error: "Saving tshirt in DB failed",
        });
      }
      res.json(testi);
    });
  });
};

exports.getTesti = (req, res) => {
  req.testi.photo = undefined;
  return res.json(req.testi);
};

//middleware
exports.photo = (req, res, next) => {
  if (req.testi.photo.data) {
    res.set("Content-Type", req.testi.photo.contentType);
    return res.send(req.testi.photo.data);
  }
  next();
};

// delete controllers
exports.deleteTesti = (req, res) => {
  let testi = req.testi;
  testi.remove((err, deletedtesti) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to delete the testi",
      });
    }
    res.json({
      message: "Deletion was a success",
      deletedtesti,
    });
  });
};

// PUT controllers
exports.updateTesti = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "problem with image",
      });
    }

    //updation code
    let testi = req.testi;
    testi = _.extend(testi, fields);

    //handle file here
    if (file.photo) {
      if (file.photo.size > 10000000) {
        return res.status(400).json({
          error: "File size too big!",
        });
      }
      testi.photo.data = fs.readFileSync(file.photo.path);
      testi.photo.contentType = file.photo.type;
    }
    // console.log(testi);

    //save to the DB
    testi.save((err, testi) => {
      if (err) {
        res.status(400).json({
          error: "Updation of testi failed",
        });
      }
      res.json(testi);
    });
  });
};

//testi listing

exports.getAllTesti = (req, res) => {
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  const testi = Testi;
  testi
    .find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy, "asc"]])
    .exec((err, testis) => {
      if (err) {
        return res.status(400).json({
          error: "NO testi FOUND",
        });
      }
      res.json(testis);
    });
};

exports.getAllUniqueCategories = (req, res) => {
  Testi.distinct("category", {}, (err, category) => {
    if (err) {
      return res.status(400).json({
        error: "NO category found",
      });
    }
    res.json(category);
  });
};

exports.updateStock = (req, res, next) => {
  let myOperations = req.body.order.testis.map((prod) => {
    return {
      updateOne: {
        filter: { _id: prod._id },
        update: { $inc: { stock: -prod.count, sold: +prod.count } },
      },
    };
  });

  Testi.bulkWrite(myOperations, {}, (err, testis) => {
    if (err) {
      return res.status(400).json({
        error: "Bulk operation failed",
      });
    }
    next();
  });
};
