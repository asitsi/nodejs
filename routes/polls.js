const express = require("express");
const router = express.Router();
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const {
  showPolls,
  createPolls,
  getPoll,
  deletePoll,
  votes,
} = require("../controllers/polls");
const { getUserById } = require("../controllers/user");

// all of params
router.param("userId", getUserById);
////show all polls
router.get("/polls", showPolls);

// Create Poll
router.post("/polls/create/", createPolls);

router.get("/poll/:pollId", getPoll);

//delete Blog
router.delete(
  "/poll/:pollId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  deletePoll
);

// vote POST ROUTE
router.post("/vote/:pollId", votes);

module.exports = router;
