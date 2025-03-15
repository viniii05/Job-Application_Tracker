const express = require("express");
const { requireAuth } = require("../middleware/authMiddleware");
const userController = require("../controllers/userController");

const router = express.Router();

router.get("/user", requireAuth, userController.getUser);
router.put("/user", requireAuth, userController.updateUser);

module.exports = router;
