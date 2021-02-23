const express = require("express");
const router = express.Router();

const {
  getCategoryById,
  createCategory,
  getCategory,
  getAllCategory,
  updateCategory,
  removeCategory,
} = require("../controllers/cacategory");
const { isSignedIn, isAdmin, isAuthenticated } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");

//params
router.param("userId", getUserById);
router.param("cacategoryId", getCategoryById);

//actual routers goes here

//create
router.post(
  "/cacategory/create/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  createCategory
);

//read
router.get("/cacategory/:cacategoryId", getCategory);
router.get("/cacategories", getAllCategory);

//update
router.put(
  "/cacategory/:cacategoryId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateCategory
);

//delete

router.delete(
  "/cacategory/:cacategoryId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  removeCategory
);

module.exports = router;
