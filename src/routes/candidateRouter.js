const express = require("express");
const router = express.Router();
const candidateController = require("../controllers/candidateController");
const { authenticate, isAdmin} = require("../middleware/authMiddleware");
const uploadImage = require("../middleware/uploadImage");

router.post("/create_candidate", authenticate, isAdmin, uploadImage.single("image"), candidateController.createCandidate)
router.get("/candidates", authenticate, candidateController.getAllCandidate);
router.patch("/candidate/:id", authenticate, isAdmin, uploadImage.single("image"), candidateController.updateCandidate);
router.delete("/candidate/:id", authenticate, isAdmin, candidateController.deleteCandidate);


module.exports = router;