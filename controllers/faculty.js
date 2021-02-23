const Faculty = require("../models/faculty");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");

exports.getFacultyById = (req, res, next, id) => {
  Faculty.findById(id)
    .populate("category")
    .exec((err, faculty) => {
      if (err) {
        return res.status(400).json({
          error: "Faculty not found",
        });
      }
      req.faculty = faculty;
      next();
    });
};

exports.createFaculty = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "problem with image",
      });
    }
    //destructure the fields
    const { name, qualification, skill, achievement } = fields;

    if (!name || !qualification || !skill || !achievement) {
      return res.status(400).json({
        error: "Please include all fields",
      });
    }

    let faculty = new Faculty(fields);

    //handle file here
    if (file.photo) {
      if (file.photo.size > 100000000) {
        return res.status(400).json({
          error: "File size too big!",
        });
      }
      faculty.photo.data = fs.readFileSync(file.photo.path);
      faculty.photo.contentType = file.photo.type;
    }
    // console.log(faculty);

    //save to the DB
    faculty.save((err, faculty) => {
      if (err) {
        res.status(400).json({
          error: "Saving tshirt in DB failed",
        });
      }
      res.json(faculty);
    });
  });
};

exports.getFaculty = (req, res) => {
  req.faculty.photo = undefined;
  return res.json(req.faculty);
};

//middleware
exports.photo = (req, res, next) => {
  if (req.faculty.photo.data) {
    res.set("Content-Type", req.faculty.photo.contentType);
    return res.send(req.faculty.photo.data);
  }
  next();
};

// delete controllers
exports.deleteFaculty = (req, res) => {
  let faculty = req.faculty;
  faculty.remove((err, deletedFaculty) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to delete the faculty",
      });
    }
    res.json({
      message: "Deletion was a success",
      deletedFaculty,
    });
  });
};

// PUT controllers
exports.updateFaculty = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "problem with image",
      });
    }

    //updation code
    let faculty = req.faculty;
    faculty = _.extend(faculty, fields);

    //handle file here
    if (file.photo) {
      if (file.photo.size > 10000000) {
        return res.status(400).json({
          error: "File size too big!",
        });
      }
      faculty.photo.data = fs.readFileSync(file.photo.path);
      faculty.photo.contentType = file.photo.type;
    }
    // console.log(faculty);

    //save to the DB
    faculty.save((err, faculty) => {
      if (err) {
        res.status(400).json({
          error: "Updation of faculty failed",
        });
      }
      res.json(faculty);
    });
  });
};

//faculty listing

exports.getAllFaculty = (req, res) => {
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  const faculty = Faculty;
  faculty
    .find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy, "asc"]])
    .exec((err, facultys) => {
      if (err) {
        return res.status(400).json({
          error: "NO faculty FOUND",
        });
      }
      res.json(facultys);
    });
};

exports.getAllUniqueCategories = (req, res) => {
  Faculty.distinct("category", {}, (err, category) => {
    if (err) {
      return res.status(400).json({
        error: "NO category found",
      });
    }
    res.json(category);
  });
};

exports.updateStock = (req, res, next) => {
  let myOperations = req.body.order.facultys.map((prod) => {
    return {
      updateOne: {
        filter: { _id: prod._id },
        update: { $inc: { stock: -prod.count, sold: +prod.count } },
      },
    };
  });

  Faculty.bulkWrite(myOperations, {}, (err, facultys) => {
    if (err) {
      return res.status(400).json({
        error: "Bulk operation failed",
      });
    }
    next();
  });
};
