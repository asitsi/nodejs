const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const {
  createfeedback,
  getcreatedfeedback,
} = require("../controllers/feedback");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");

router.post(
  "/feedback",
  [
    check("title")
      .isLength({ min: 3 })
      .withMessage("Title field at least 3 char"),
    check("email").isEmail().withMessage("Please Fill right Email"),
    check("description")
      .isLength({ min: 3 })
      .withMessage("Please write your Feedback"),
  ],
  createfeedback
);
router.get(
  "/getfeedback",

  getcreatedfeedback
);

module.exports = router;
