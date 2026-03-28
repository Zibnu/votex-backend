const express = require("express");
const router = express.Router();
const settingController = require("../controllers/settingController");
const { authenticate, isAdmin } = require("../middleware/authMiddleware");

router.get("/data_setting", authenticate, settingController.getSetting);
router.patch("/toogle_setting", authenticate, isAdmin, settingController.toogleVoting);
router.delete("/reset", authenticate, isAdmin, settingController.resetVoting);

module.exports = router;