const express = require("express");
const router = express.Router();
const {
  getFacultyById,
  createFaculty,
  getFaculty,
  photo,
  deleteFaculty,
  updateFaculty,
  getAllFaculty,
} = require("../controllers/faculty");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");

// all of params
router.param("userId", getUserById);
router.param("facultyId", getFacultyById);

// create Faculty ///
router.post(
  "/faculty/create/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  createFaculty
);

// read routes
router.get("/faculty/:facultyId", getFaculty);
router.get("/faculty/photo/:facultyId", photo);

//delete Blog
router.delete(
  "/faculty/:facultyId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  deleteFaculty
);

// Update Faculty

router.put(
  "/faculty/:facultyId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateFaculty
);

// listing all Facultys
router.get("/facultys", getAllFaculty);

module.exports = router;
