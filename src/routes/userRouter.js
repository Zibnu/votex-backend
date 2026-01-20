const express = require("express");
const router = express.Router();
const { authenticate, isAdmin } = require("../middleware/authMiddleware");
const userController = require("../controllers/userController");
const uploadExcel = require("../middleware/uploadExcel");

router.post("/import", authenticate, isAdmin, uploadExcel.single("file"), userController.importUsers);
router.get("/export", authenticate, isAdmin, userController.exportsUsers);


module.exports = router;