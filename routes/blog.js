const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const Blog = require("../models/blog");
const {
  getBlogById,
  createBlog,
  getBlog,
  photo,
  deleteBlog,
  updateBlog,
  getAllBlogs,
  getAllComments,
  postComment,
  like,
} = require("../controllers/blog");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");
const { route } = require("./product");

// all of params
router.param("userId", getUserById);
router.param("blogId", getBlogById);

// All Actual Route
router.post(
  "/blog/create/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  createBlog
);

// read routes
router.get("/blog/:blogId", getBlog);
router.get("/blog/photo/:blogId", photo);

//delete Blog
router.delete(
  "/blog/:blogId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  deleteBlog
);

// Update Blog

router.put(
  "/blog/:blogId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateBlog
);

// listing all Blogs
router.get("/blogs", getAllBlogs);

//All comments
router.get("/blog/:blogId/comments", getAllComments);
/// Post Comments
router.post(
  "/blog/:blogId/postComment",
  [
    check("user").isEmail().withMessage("Please Login First"),
    check("content").isLength({ min: 1 }).withMessage("Please Write Comment"),
  ],
  postComment
);
/// Post Likes
router.put("/like/:Id", async (req, res) => {
  const blogid = req.params.Id;
  const userId = req.body.user;
  // console.log(blogid);
  // console.log(userId);
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
});

router.put("/unlike/:Id", async (req, res) => {
  const blogid = req.params.Id;
  const userId = req.body.user;
  // console.log(blogid);
  // console.log(userId);
  Blog.findByIdAndUpdate(
    blogid,
    {
      $pull: { likes: req.body.user },
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
});

module.exports = router;
