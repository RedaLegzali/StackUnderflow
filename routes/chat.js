const router = require("express").Router();
const { isConnected } = require("../middleware/security");
const { getCategories } = require('../utils')

// Get Chat Room Page
router.get("/", isConnected, (req, res) => {
  res.render("app/chat", {
    title: "Chat Room",
    image: req.session.user.image,
    categories: getCategories(req.session.user.team)
  });
});

module.exports = router;
