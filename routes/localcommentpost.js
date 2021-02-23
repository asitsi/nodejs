const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const {
  createLocalcomment,
  getLocalCommentSubmit,
} = require("../controllers/localcommentpost");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");

router.post(
  "/LocalCommentSubmit",
  [
    check("name")
      .isLength({ min: 3 })
      .withMessage("Name field at least 3 char"),
    check("email").isEmail().withMessage("Please Fill right Email"),
    check("description")
      .isLength({ min: 3 })
      .withMessage("Please write your issue"),
  ],
  createLocalcomment
);
router.get("/GetLocalCommentSubmit", getLocalCommentSubmit);

module.exports = router;
