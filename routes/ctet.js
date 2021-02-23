const express = require("express");
const router = express.Router();
const {
  getctetById,
  createctet,
  getctet,
  getAllctets,
  deletectet,
  updatectet,
  video,
} = require("../controllers/ctet");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");

// all of params
router.param("userId", getUserById);
router.param("ctetId", getctetById);

// All Actual Route
router.post(
  "/ctet/create/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  createctet
);

// read routes
router.get("/ctet/:ctetId", getctet);
router.get("/ctet/video/:ctetId", video);

//delete Blog
router.delete(
  "/delete/:ctetId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  deletectet
);

// Update Blog

router.put(
  "/update/:ctetId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updatectet
);

// listing all Blogs
router.get("/ctets", getAllctets);

module.exports = router;
