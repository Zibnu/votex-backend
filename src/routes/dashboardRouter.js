const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");
const { authenticate, isAdmin } = require("../middleware/authMiddleware");

router.get("/dashboard_data", authenticate, isAdmin, dashboardController.dashboard);

module.exports = router;