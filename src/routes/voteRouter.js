const express = require("express");
const router = express.Router();
const voteControllers = require("../controllers/voteControllers");
const { authenticate } = require("../middleware/authMiddleware");

router.post("/submit_vote", authenticate, voteControllers.submitVote);

module.exports = router;
