const Poll = require("../models/polls");
const { validationResult } = require("express-validator");

// const { options } = require("../routes/polls");

exports.showPolls = async (req, res, next) => {
  try {
    const polls = await Poll.find();
    res.status(200).json(polls);
  } catch (error) {
    error.status = 400;
    next(error);
  }
};

exports.createPolls = async (req, res, next) => {
  try {
    const { question, options } = req.body;
    // console.log(question, options, req.body);
    const dynamic = {};
    options.forEach((opt) => {
      dynamic[opt.toLowerCase()] = [];
    });
    const polls = await Poll.create({
      question,
      options: dynamic,
    });
    polls.save((err, polls) => {
      if (err) {
        res.status(400).json({
          error: "Saving Poll in DB failed",
        });
      }
      res.json(polls);
    });
  } catch (error) {
    error.status = 400;
    next(error);
  }
};

exports.getPoll = async (req, res, next) => {
  try {
    const { pollId } = req.params;
    const polls = await Poll.findById(pollId);
    if (!polls) throw new Error("no polls found");
    res.status(200).json(polls);
  } catch (error) {
    error.status = 400;
    next(error);
  }
};

exports.deletePoll = async (req, res, next) => {
  try {
    const { pollId } = req.params;
    const polls = await Poll.findById(pollId);
    if (!polls) {
      throw new Error("no Polls found");
    } else {
      await polls.remove();
      res.status(202).json({
        error: "Poll deleted successfully",
      });
    }
  } catch (error) {
    res.status = 400;
    next(error);
  }
};

exports.votes = async (req, res, next) => {
  try {
    /**
     * 1. get the poll from db
     * 2. check if the user already exists in any option
     * 3. if user has already selected any option do nothing
     * 4. if user has selected any other option remove from that option
     * 5. if user does not exist in any option, insert his user id to selected option
     */
    const { pollId } = req.params;
    console.log(pollId);
    let { userId, answer } = req.body;
    console.log(userId);
    console.log(answer);
    // get selected poll from db
    const poll = await Poll.findById(pollId);
    if (answer && poll) {
      answer = answer.toLowerCase();
      ///Finf the Poll

      let existingVote = null;
      Object.keys(poll.options).forEach((option) => {
        console.log("heloo", option, poll.options[option]);
        // loop on all options, check if the user already exists in any option
        if (
          poll.options[option] &&
          Array.isArray(poll.options[option]) &&
          poll.options[option].indexOf(userId) !== -1
        ) {
          existingVote = option;
        }
      });
      if (existingVote == null) {
        // if there is no existing vote save it to db
        try {
          const push = {};
          push[`options.${answer}`] = userId;
          const update = await Poll.findByIdAndUpdate(
            pollId,
            { $push: push },
            { upsert: true }
          );
          res.status(201).json(update);
        } catch (err) {
          error.status = 400;
          next(error);
        }
      } else if (existingVote && existingVote.length > 0) {
        // check if answer is same as previous, if yes send not modified
        if (existingVote.toLowerCase() === answer.toLowerCase()) {
          res.status(304).send("Response already saved");
        } else {
          // delete the previous response and save it in new
          if (
            Array.isArray(poll.options[existingVote]) &&
            poll.options[existingVote].length > 0
          ) {
            // TODO: filtering this is not returning array but 1
            poll.options[existingVote] = poll.options[existingVote].filter(
              (vote) => vote != userId
            );
            poll.options[answer] = poll.options[answer].push(userId);
            const update = await Poll.findByIdAndUpdate(pollId, {
              $set: { options: poll.options },
            });
            res.status(201).json(update);
          }
        }
      } else {
        error = {
          status: 500,
          message: "Something went wrong",
        };
        next(error);
      }
    } else {
      error = {
        status: 404,
        message: "Poll not found",
      };
      next(error);
    }
  } catch (error) {
    error.status = 400;
    next(error);
  }
};
