const createError = require('http-errors');

module.exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).json({ message: "No te has logueado" });
  }
}

module.exports.isAdmin = (req, res, next) => {
  if (req.user.role === "Admin") {
    return next();
  } else {
    next(createError(403));
  }
}







