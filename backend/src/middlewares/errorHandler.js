const env = require("../config/env");

function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  if (error.name === "ZodError") {
    return res.status(422).json({
      message: "Gönderilen bilgiler doğrulanamadı.",
      details: error.errors
    });
  }

  const status = error.status || 500;
  const payload = {
    message: status === 500 ? "Beklenmeyen bir hata oluştu." : error.message
  };

  if (error.details) {
    payload.details = error.details;
  }

  if (env.nodeEnv !== "production" && status === 500) {
    payload.stack = error.stack;
  }

  return res.status(status).json(payload);
}

module.exports = errorHandler;
