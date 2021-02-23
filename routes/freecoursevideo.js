const express = require("express");
const router = express.Router();
const {
  getFreecoursevideoById,
  createFreecoursevideo,
  getFreecoursevideo,
  getAllFreecoursevideos,
  deleteFreecoursevideo,
  updateFreecoursevideo,
  video,
} = require("../controllers/freecoursevideo");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");

// all of params
router.param("userId", getUserById);
router.param("freecoursevideoId", getFreecoursevideoById);

// All Actual Route
router.post(
  "/freecoursevideo/create/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  createFreecoursevideo
);

// read routes
router.get("/freecoursevideo/:freecoursevideoId", getFreecoursevideo);
router.get("/freecoursevideo/video/:freecoursevideoId", video);

//delete Blog
router.delete(
  "/delete/:freecoursevideoId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  deleteFreecoursevideo
);

// Update Blog

router.put(
  "/update/:freecoursevideoId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateFreecoursevideo
);

// listing all Blogs
router.get("/freecoursevideos", getAllFreecoursevideos);

module.exports = router;
