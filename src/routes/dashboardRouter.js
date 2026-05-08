const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");
const { authenticate, isAdmin } = require("../middleware/authMiddleware");

router.get("/dashboard_data", authenticate, isAdmin, dashboardController.dashboard);
router.get("/export_pdf", authenticate, isAdmin , dashboardController.exportVotingPDF);

module.exports = router;