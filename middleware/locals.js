const { getTeams, getCategories } = require("../utils");

const getLocals = (req, res, next) => {
  let locals = req.flash("locals");
  if (locals.length > 0) {
    let local = locals[0];
    for (let key in local) {
      res.locals[key] = local[key];
    }
  }
  if (req.session.user) {
    res.locals.user = req.session.user;
    (res.locals.teams = getTeams(req.session.user.team)),
      (res.locals.categories = getCategories(req.session.user.team));
  } else {
    res.locals.teams = getTeams();
  }
  next();
};

module.exports = getLocals;
