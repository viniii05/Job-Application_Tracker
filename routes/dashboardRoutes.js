const express = require("express");
const dashboardController = require("../controllers/dashboardController");
const { requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", requireAuth, dashboardController.showDashboard);
router.get("/dashboard-data", requireAuth, (req, res) => {
    res.json({ user: req.user, message: "Dashboard data loaded" });
});

module.exports = router;
