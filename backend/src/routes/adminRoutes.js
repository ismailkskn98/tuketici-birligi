const express = require("express");
const adminContentController = require("../controllers/adminContentController");
const adminHeroController = require("../controllers/adminHeroController");
const boardMemberController = require("../controllers/boardMemberController");
const formSubmissionController = require("../controllers/formSubmissionController");
const mediaController = require("../controllers/mediaController");
const provinceMapController = require("../controllers/provinceMapController");
const settingsController = require("../controllers/settingsController");
const userController = require("../controllers/userController");
const { requireAuth, requireRole } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();

router.use(requireAuth);

router.get("/content", adminContentController.listContent);
router.post("/content", adminContentController.createContent);
router.patch("/content/:id", adminContentController.updateContent);
router.delete("/content/:id", adminContentController.deleteContent);

router.get("/hero-slides", adminHeroController.listHeroSlides);
router.post("/hero-slides", adminHeroController.createHeroSlide);
router.post("/hero-slides/translate", adminHeroController.translateHeroSlide);
router.patch("/hero-slides/:id", adminHeroController.updateHeroSlide);
router.delete("/hero-slides/:id", adminHeroController.deleteHeroSlide);

router.get("/board-members", boardMemberController.listBoardMembers);
router.post("/board-members", boardMemberController.createBoardMember);
router.patch("/board-members/:id", boardMemberController.updateBoardMember);
router.delete("/board-members/:id", boardMemberController.deleteBoardMember);
router.get("/board-member-categories", boardMemberController.listBoardMemberCategories);
router.post("/board-member-categories", boardMemberController.createBoardMemberCategory);
router.patch("/board-member-categories/:id", boardMemberController.updateBoardMemberCategory);
router.delete("/board-member-categories/:id", boardMemberController.deleteBoardMemberCategory);

router.get("/province-map", provinceMapController.listProvinceMapEntries);
router.post("/province-map", provinceMapController.createProvinceMapEntry);
router.patch("/province-map/:id", provinceMapController.updateProvinceMapEntry);
router.delete("/province-map/:id", provinceMapController.deleteProvinceMapEntry);

router.get("/media", mediaController.listMedia);
router.post("/media", upload.single("file"), mediaController.uploadMedia);
router.delete("/media/:id", mediaController.deleteMedia);

router.get("/settings", settingsController.listSettings);
router.patch("/settings", settingsController.updateSettings);

router.get("/form-submissions", formSubmissionController.listSubmissions);
router.patch("/form-submissions/:id", formSubmissionController.updateSubmission);

router.get("/users", requireRole(["super_admin"]), userController.listUsers);
router.post("/users", requireRole(["super_admin"]), userController.createUser);
router.patch("/users/:id", requireRole(["super_admin"]), userController.updateUser);

module.exports = router;
