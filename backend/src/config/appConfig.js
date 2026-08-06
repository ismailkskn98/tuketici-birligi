const env = require("./env");

module.exports = {
  appName: "Tüketici Birliği API",
  isProduction: env.nodeEnv === "production",
  publicFormTypes: ["contact", "pre_application"],
  contentTypes: ["page", "news", "announcement", "guide", "legal", "faq"],
  contentStatuses: ["draft", "published"],
  submissionStatuses: ["new", "in_review", "resolved", "spam"],
};
