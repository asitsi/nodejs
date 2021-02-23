const Blog = require("../models/blog");
const Comment = require("../models/comment");
const like = require("../models/likes");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const { validationResult } = require("express-validator");

exports.getBlogById = (req, res, next, id) => {
  Blog.findById(id)
    .populate("category")
    .exec((err, blog) => {
      if (err) {
        return res.status(400).json({
          error: "Blog not found",
        });
      }
      req.blog = blog;
      next();
    });
};

exports.createBlog = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "problem with image",
      });
    }
    //destructure the fields
    const { title, description, tags } = fields;

    if (!title || !description || !tags) {
      return res.status(400).json({
        error: "Please include all fields",
      });
    }

    let blog = new Blog(fields);

    //handle file here
    if (file.photo) {
      if (file.photo.size > 100000000) {
        return res.status(400).json({
          error: "File size too big!",
        });
      }
      blog.photo.data = fs.readFileSync(file.photo.path);
      blog.photo.contentType = file.photo.type;
    }
    // console.log(blog);

    //save to the DB
    blog.save((err, blog) => {
      if (err) {
        res.status(400).json({
          error: "Saving Blog in DB failed",
        });
      }
      res.json(blog);
    });
  });
};

exports.getBlog = (req, res) => {
  req.blog.photo = undefined;
  return res.json(req.blog);
};

//middleware
exports.photo = (req, res, next) => {
  if (req.blog.photo.data) {
    res.set("Content-Type", req.blog.photo.contentType);
    return res.send(req.blog.photo.data);
  }
  next();
};

// delete controllers
exports.deleteBlog = (req, res) => {
  let blog = req.blog;
  blog.remove((err, deletedBlog) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to delete the blog",
      });
    }
    res.json({
      message: "Deletion was a success",
      deletedBlog,
    });
  });
};

// PUT controllers
exports.updateBlog = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "problem with image",
      });
    }

    //updation code
    let blog = req.blog;
    blog = _.extend(blog, fields);

    //handle file here
    if (file.photo) {
      if (file.photo.size > 10000000) {
        return res.status(400).json({
          error: "File size too big!",
        });
      }
      blog.photo.data = fs.readFileSync(file.photo.path);
      blog.photo.contentType = file.photo.type;
    }
    // console.log(blog);

    //save to the DB
    blog.save((err, blog) => {
      if (err) {
        res.status(400).json({
          error: "Updation of blog failed",
        });
      }
      res.json(blog);
    });
  });
};

//blog listing

exports.getAllBlogs = (req, res) => {
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  const blog = Blog;
  blog
    .find()
    .populate("user")
    .select("-photo")
    .populate("category")
    .sort([[sortBy, "asc"]])
    .exec((err, blogs) => {
      if (err) {
        return res.status(400).json({
          error: "NO blog FOUND",
        });
      }
      res.json(blogs);
    });
};
/// blog comments
exports.getAllComments = async (req, res) => {
  /// Find A Blog
  const { blogId } = req.params;
  // console.log(blogId);
  const blog = await Blog.findById(blogId).populate("comment");
  // console.log(blog);
  // console.log(req.params.blogId);
  res.send(blog);
};

/// post Comments
exports.postComment = async (req, res) => {
  /// Validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }

  /// Find A Blog
  const blog = await Blog.findOne({ _id: req.params.blogId });
  // console.log(blog);
  // console.log(req.params.blogId);
  /// Create A Comment
  const comment = new Comment();
  comment.content = req.body.content;
  comment.user = req.body.user;
  // console.log(req.body.user);
  comment.blog = blog._id;
  comment.save((err, Blog_comment) => {
    if (err) {
      return res.status(400).json({
        error: "something went wrong please try again ..!",
      });
    }
    res.json({ Blog_comment });
  });
  /// Associate Post with comment
  blog.comment.push(comment._id);
  blog.save();
  // res.send(comment);
};

/////////////////
////////////////////// likes  blog ////////////////////
exports.like = async (req, res) => {
  /// Validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }
  const blogid = req.params.Id;
  const userId = req.body.user;
  // console.log(blogid);
  console.log(userId);
  Blog.findByIdAndUpdate(
    blogid,
    {
      $push: { likes: req.body.user },
    },
    {
      new: true,
    }
  ).exec((err, result) => {
    if (err) {
      return res.status(422).json({ error: err });
    } else {
      res.json(result);
    }
  });
};

exports.getAllUniqueCategories = (req, res) => {
  Blog.distinct("category", {}, (err, category) => {
    if (err) {
      return res.status(400).json({
        error: "NO category found",
      });
    }
    res.json(category);
  });
};

exports.updateStock = (req, res, next) => {
  let myOperations = req.body.order.blogs.map((prod) => {
    return {
      updateOne: {
        filter: { _id: prod._id },
        update: { $inc: { stock: -prod.count, sold: +prod.count } },
      },
    };
  });

  Blog.bulkWrite(myOperations, {}, (err, blogs) => {
    if (err) {
      return res.status(400).json({
        error: "Bulk operation failed",
      });
    }
    next();
  });
};
