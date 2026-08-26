const express = require("express");
const boardMemberController = require("../controllers/boardMemberController");
const provinceMapController = require("../controllers/provinceMapController");
const publicController = require("../controllers/publicController");
const { publicFormLimiter } = require("../middlewares/rateLimiters");
const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();

router.get("/site-settings", publicController.getSiteSettings);
router.get("/home", publicController.getHome);
router.get("/board-members", boardMemberController.getPublicBoardMembers);
router.get("/province-map", provinceMapController.getPublicProvinceMap);
router.get("/content", publicController.getContentList);
router.get("/content/:slug", publicController.getContentBySlug);
router.post("/contact", publicFormLimiter, publicController.createContact);
router.post(
  "/pre-applications",
  publicFormLimiter,
  upload.array("files", 8),
  publicController.createPreApplication
);

module.exports = router;
