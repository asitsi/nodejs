// const ctet = require("../models/ctet");
const Ctet = require("../models/ctet");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");

exports.getctetById = (req, res, next, id) => {
  Ctet.findById(id)
    .populate("category")
    .exec((err, ctet) => {
      if (err) {
        return res.status(400).json({
          error: "ctet not found",
        });
      }
      req.ctet = ctet;
      next();
    });
};

exports.createctet = (req, res) => {
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

    let ctet = new Ctet(fields);

    //handle file here
    if (file.video) {
      if (file.video.size > 10e9) {
        return res.status(400).json({
          error: "File size too big!",
        });
      }
      ctet.video.data = fs.readFileSync(file.video.path);
      ctet.video.contentType = file.video.type;
    }
    // console.log(ctet);

    //save to the DB
    ctet.save((err, ctet) => {
      if (err) {
        res.status(400).json({
          error: "Saving tshirt in DB failed",
        });
      }
      res.json(ctet);
    });
  });
};

exports.getctet = (req, res) => {
  req.ctet.video = undefined;
  return res.json(req.ctet);
};

//middleware
exports.video = (req, res, next) => {
  if (req.ctet.video.data) {
    res.set("Content-Type", req.ctet.video.contentType);
    return res.send(req.ctet.video.data);
  }
  next();
};

// delete controllers
exports.deletectet = (req, res) => {
  let ctet = req.ctet;
  ctet.remove((err, deletedctet) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to delete the ctet",
      });
    }
    res.json({
      message: "Deletion was a success",
      deletedctet,
    });
  });
};

// PUT controllers
exports.updatectet = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "problem with image",
      });
    }

    //updation code
    let ctet = req.ctet;
    ctet = _.extend(ctet, fields);

    //handle file here
    if (file.video) {
      if (file.video.size > 10000000) {
        return res.status(400).json({
          error: "File size too big!",
        });
      }
      ctet.video.data = fs.readFileSync(file.video.path);
      ctet.video.contentType = file.video.type;
    }
    // console.log(ctet);

    //save to the DB
    ctet.save((err, ctet) => {
      if (err) {
        res.status(400).json({
          error: "Updation of ctet failed",
        });
      }
      res.json(ctet);
    });
  });
};

//ctet listing

exports.getAllctets = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 8;
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  const ctet = Ctet;
  ctet
    .find()
    .select("-video")
    .populate("category")
    .sort([[sortBy, "asc"]])
    .limit(limit)
    .exec((err, ctets) => {
      if (err) {
        return res.status(400).json({
          error: "NO ctet FOUND",
        });
      }
      res.json(ctets);
    });
};

exports.getAllUniqueCategories = (req, res) => {
  Ctet.distinct("category", {}, (err, category) => {
    if (err) {
      return res.status(400).json({
        error: "NO category found",
      });
    }
    res.json(category);
  });
};

exports.updateStock = (req, res, next) => {
  let myOperations = req.body.order.ctets.map((prod) => {
    return {
      updateOne: {
        filter: { _id: prod._id },
        update: { $inc: { stock: -prod.count, sold: +prod.count } },
      },
    };
  });

  Ctet.bulkWrite(myOperations, {}, (err, ctets) => {
    if (err) {
      return res.status(400).json({
        error: "Bulk operation failed",
      });
    }
    next();
  });
};
