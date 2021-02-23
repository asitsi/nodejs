const express = require("express");
const router = express.Router();
const {
  getTestiById,
  createTesti,
  getTesti,
  photo,
  deleteTesti,
  updateTesti,
  getAllTesti,
} = require("../controllers/testimonial");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");

// all of params
router.param("userId", getUserById);
router.param("testiId", getTestiById);

// create testi ///
router.post(
  "/testi/create/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  createTesti
);

// read routes
router.get("/testi/:testiId", getTesti);
router.get("/testi/photo/:testiId", photo);

//delete Blog
router.delete(
  "/testi/:testiId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  deleteTesti
);

// Update testi

router.put(
  "/testi/:testiId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateTesti
);

// listing all testis
router.get("/testis", getAllTesti);

module.exports = router;
