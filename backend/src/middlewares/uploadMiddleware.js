const multer = require("multer");
const env = require("../config/env");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: env.upload.maxFileMb * 1024 * 1024,
    files: 8
  }
});

module.exports = upload;

