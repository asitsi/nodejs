const express = require("express");
const testOperations = require("../controllers/quiz");
const { getQuizById } = require("../controllers/testUser");
const scoremodel = require("../models/quiz");
const timermodel = require("../models/quiz");
const { getUserById } = require("../controllers/user");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const router = express.Router();

// all of params
router.param("userId", getUserById);
router.param("quizId", getQuizById);

//for admin
router.post("/postdata", (req, res) => {
  isSignedIn, isAuthenticated, isAdmin;
  const obj = req.body;
  testOperations.savedata(obj, res);
});

router.get("/givedata", (req, res) => {
  isSignedIn, isAuthenticated, isAdmin;
  testOperations.showdata(res);
});

router.put("/:userId", (req, res) => {
  isSignedIn, isAuthenticated, isAdmin;
  const id = req.params.id;
  const obj = req.body;
  testOperations.updateit(id, obj, res);
});

router.delete("/:userId", (req, res) => {
  isSignedIn, isAuthenticated, isAdmin;
  const id = req.params.id;
  testOperations.deleteit(id, res);
});
router.post("/updatetimer", (req, res) => {
  isSignedIn, isAuthenticated, isAdmin;
  const obj = req.body;
  timermodel.find({}, (err, docs) => {
    if (err) {
      console.log(err);
    } else {
      timermodel.findByIdAndUpdate(
        docs[0]._id,
        {
          timer: obj.timer,
        },
        (err) => {
          if (err) {
            console.log(err);
          }
        }
      );
      res.send("Exam duration updated");
    }
  });
});
//for user
router.get("/givetime", (req, res) => {
  timermodel.find({}, (err, docs) => {
    if (err) {
      res.send(err);
    } else {
      res.json(docs[0]);
    }
  });
});

router.post("/postscore", (req, res) => {
  const obj = req.body;
  const flag = 0;
  scoremodel.find({}, (err, docs) => {
    if (err) {
      res.send(err);
    } else {
      if (docs && docs.length > 0) {
        for (const i = 0; i < docs.length; i++) {
          if (obj.score == docs[i].score) {
            obj.rank = docs[i].rank;
            flag = 1;
            break;
          }
        }
        if (flag == 1) {
          const scoreobj = new scoremodel(obj);
          scoreobj.save((err) => {
            if (err) {
              res.send(err);
            } else {
              res.json({ rank: obj.rank, msg: "Your Rank is : " });
            }
          });
        } else if (flag == 0) {
          var j;
          docs.sort((a, b) => b.score - a.score);
          for (const i = 0; i < docs.length; i++) {
            if (obj.score > docs[i].score) {
              obj.rank = docs[i].rank - 1;
              if (obj.rank == 0) {
                obj.rank = 1;
              }
              flag = 2;
              j = i;
              break;
            } else if (obj.score < docs[i].score) {
              obj.rank = docs[i].rank + 1;
            }
          }
          if (flag == 2) {
            docs.sort((a, b) => b.score - a.score);
            for (j; j < docs.length; j++) {
              scoremodel.findByIdAndUpdate(
                docs[j]._id,
                {
                  rank: docs[j].rank + 1,
                },
                (err) => {
                  if (err) {
                    console.log(err);
                  }
                }
              );
            }
          }
          const scoreobj = new scoremodel(obj);
          scoreobj.save((err) => {
            if (err) {
              res.send(err);
            } else {
              res.json({ rank: obj.rank, msg: "Your Rank is : " });
            }
          });
        }
      }
    }
  });
});

router.get("/givescore", (req, res) => {
  scoremodel.find({}, (err, docs) => {
    if (err) {
      res.send(err);
    }
    if (docs && docs.length > 0) {
      res.json(docs);
    }
  });
});
module.exports = router;
