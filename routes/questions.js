const router = require("express").Router();
const Question = require("../models/Question");
const { isConnected } = require("../middleware/security");
const { getCategories } = require("../utils");

// Get questions page
router.get("/", isConnected, async (req, res) => {
  let search = req.query.search;
  let category = req.query.category;
  let questions;
  let categories = getCategories(req.session.user.team)
  if (typeof search == "undefined" && typeof category == "undefined")
    questions = await Question.find({ category: { $in: categories } });
  else if (typeof search == "undefined")
    questions = await Question.find({ category: category });
  else if (typeof category == "undefined")
    questions = await Question.find({
      subject: { $regex: search, $options: "gi" },
      category: { $in: categories }
    });
  else
    questions = await Question.find({
      subject: { $regex: search, $options: "gi" },
      category: category
    });
  let errors = [];
  let success = "";
  res.render("app/questions", {
    title: "Questions",
    image: req.session.user.image,
    questions,
    errors,
    success,
    categories
  });
});
// Post Question
router.post("/", isConnected, async (req, res) => {
  let { subject, body, category } = req.body;
  let errors = [];
  let success = "";
  if (!subject || !body || !category) errors.push("All fields are required");
  if (subject) {
    let question = Question.findOne({ subject: subject });
    if (question) errors.push("This subject already exists");
  }
  if (errors.length == 0) {
    let question = new Question({
      user: req.session.user.email,
      subject,
      body,
      category
    });
    question.save();
    success = "Question added successfully";
  }
  let categories = getCategories(req.session.user.team)
  let questions = await Question.find({ category: { $in: categories } });
  res.render("app/questions", {
    title: "Questions",
    image: req.session.user.image,
    questions,
    errors,
    success,
    categories
  });
});

module.exports = router;
