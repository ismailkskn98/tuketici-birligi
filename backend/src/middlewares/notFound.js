const httpError = require("../utils/httpError");

function notFound(req, res, next) {
  next(httpError(404, "Endpoint bulunamadı."));
}

module.exports = notFound;

