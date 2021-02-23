const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const { getUserById } = require("../controllers/user");
const {
  CAPost,
  getCA,
  deleteCA,
  putCA,
} = require("../controllers/currentaffears");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");

router.param("userId", getUserById);
router.post(
  "/PostCA/create/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  CAPost
);
router.get("/getCA", getCA);
router.delete(
  "/CA/:CAId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  deleteCA
);
router.put("/CA/:CAId:userId", isSignedIn, isAuthenticated, isAdmin, putCA);

module.exports = router;
