const isConnected = (req, res, next) => {
  if (req.session.user) next();
  else {
    res.redirect("/auth/login");
    return;
  }
};

const isNotConnected = (req, res, next) => {
  if (!req.session.user) next();
  else {
    res.redirect("/questions");
    return;
  }
};

module.exports = { isConnected, isNotConnected };
