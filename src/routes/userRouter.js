const express = require("express");
const router = express.Router();
const { authenticate, isAdmin } = require("../middleware/authMiddleware");
const userController = require("../controllers/userController");
const uploadExcel = require("../middleware/uploadExcel");

router.post("/import", authenticate, isAdmin, uploadExcel.single("file"), userController.importUsers);
router.get("/export", authenticate, isAdmin, userController.exportsUsers);
router.get("/voteStatus", authenticate, isAdmin, userController.getVotingStatus);
router.get("/not_voted_data", authenticate, isAdmin, userController.getUserNotVoted);
router.patch("/user/:id", authenticate, isAdmin, userController.updateUser);
router.get("/users_data", authenticate, isAdmin, userController.getAllUser);
router.delete("/user/:id", authenticate, isAdmin, userController.deleteUser);

module.exports = router;