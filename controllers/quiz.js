const testmodel = require("../models/quiz");

const testOperations = {
  savedata(obj, res) {
    var obj = new testmodel(obj);
    obj.save((err) => {
      if (err) {
        res.send(err);
      } else {
        res.send("Successfully saved");
      }
    });
  },

  showdata(res) {
    testmodel.find({}, (err, docs) => {
      if (err) {
        res.send("error");
      } else {
        if (docs && docs.length > 0) {
          res.json(docs);
        }
      }
    });
  },

  updateit(id, obj, res) {
    //{ name: obj.name, rollno: obj.rollno}

    testmodel.findByIdAndUpdate(
      id,
      {
        quesno: obj.quesno,
        question: obj.question,
        options: [
          { answer: obj.options[0].answer },
          { answer: obj.options[1].answer },
          { answer: obj.options[2].answer },
          { answer: obj.options[3].answer },
        ],
        selected: obj.selected,
        correct: obj.correct,
      },
      (err) => {
        if (err) {
          res.send("err");
        } else {
          res.send("updated");
        }
      }
    );
  },

  deleteit(req, res) {
    let quiz = req.body;
    quiz.remove((err, deleteit) => {
      if (err) {
        return res.status(400).json({
          error: "Failed to delete the blog",
        });
      }
      res.json({
        message: "Deletion was a success",
        deletedBlog,
      });
    });
  },
};
module.exports = testOperations;
