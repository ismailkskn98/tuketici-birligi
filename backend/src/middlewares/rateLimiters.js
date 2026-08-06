const rateLimit = require("express-rate-limit");

const publicFormLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Çok fazla form gönderimi denendi. Lütfen daha sonra tekrar deneyin." }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Çok fazla giriş denemesi. Lütfen daha sonra tekrar deneyin." }
});

module.exports = {
  authLimiter,
  publicFormLimiter
};

