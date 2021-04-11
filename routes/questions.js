const router = require("express").Router();
const Question = require("../models/Question");
const { isConnected } = require("../middleware/security");
const ObjectId = require("mongoose").Types.ObjectId;
const isValid = require("mongoose").Types.ObjectId.isValid;

// Get Single question
router.get("/:id", isConnected, async (req, res) => {
  if (isValid(req.params.id)) {
    let question = await Question.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "email",
          as: "user"
        }
      },
      { $unwind: "$user" },
      { $match: { _id: ObjectId(req.params.id) } }
    ]);
    if (question.length == 0) res.redirect("/questions");
    else {
      question = question[0];
      res.render("app/question", {
        title: question.subject,
        question
      });
    }
  } else res.redirect("/questions");
});
// Post answer question
router.post("/:id", isConnected, async (req, res) => {
  let { best, body } = req.body;
  let id = req.params.id;
  let locals;
  let success = "";
  if (best) {
    let id = req.params.id;
    let question = await Question.findOne({ _id: id });
    question.best = best;
    await question.save();
    success = "Answer voted successfully";
    locals = { success };
  } else {
    let errors = [];
    if (!body) errors.push("Answer can't be blank");
    if (errors.length == 0) {
      let question = await Question.findOne({ _id: id });
      question.answers.push({
        _id: ObjectId(),
        body,
        user: req.session.user.name
      });
      await question.save();
      success = "Answer added successfully";
      locals = { success };
    } else locals = { errors, success, body };
  }
  req.flash("locals", locals);
  res.redirect(`/questions/${id}`);
});
// Get questions page
router.get("/", isConnected, async (req, res) => {
  let search = req.query.search;
  let category = req.query.category;
  let questions;
  if (typeof search == "undefined" && typeof category == "undefined") {
    questions = await Question.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "email",
          as: "user"
        }
      },
      { $unwind: "$user" },
      { $match: { category: { $in: res.locals.categories } } }
    ]);
  } else if (typeof search == "undefined") {
    questions = await Question.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "email",
          as: "user"
        }
      },
      { $unwind: "$user" },
      {
        $match: {
          $and: [
            { category: { $in: res.locals.categories } },
            { category: category }
          ]
        }
      }
    ]);
  } else if (typeof category == "undefined") {
    questions = await Question.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "email",
          as: "user"
        }
      },
      { $unwind: "$user" },
      {
        $match: {
          $and: [
            { category: { $in: res.locals.categories } },
            { subject: { $regex: search, $options: "gi" } }
          ]
        }
      }
    ]);
  } else {
    questions = await Question.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "email",
          as: "user"
        }
      },
      { $unwind: "$user" },
      {
        $match: {
          $and: [
            { category: { $in: res.locals.categories } },
            { category: category },
            { subject: { $regex: search, $options: "gi" } }
          ]
        }
      }
    ]);
  }
  res.render("app/questions", {
    title: "Questions",
    questions, selected: category
  });
});
// Post Question
router.post("/", isConnected, async (req, res) => {
  let { subject, body, category } = req.body;
  let errors = [];
  let success = "";
  let locals;
  if (!subject || !body || !category) errors.push("All fields are required");
  if (subject) {
    let question = await Question.findOne({ subject: subject });
    if (question) errors.push("This subject already exists");
  }
  if (errors.length == 0) {
    let question = new Question({
      user: req.session.user.email,
      subject,
      body,
      category
    });
    await question.save();
    success = "Question added successfully";
    locals = { success };
  } else locals = { errors, success, subject, body };
  req.flash("locals", locals);
  res.redirect("/questions");
});

module.exports = router;
