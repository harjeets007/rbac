const { error } = require("../services/responseSerivce");

const roleMiddleware = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return error(403, "Access denied", null, res);
    }
    next();
  };
};

module.exports = roleMiddleware;
