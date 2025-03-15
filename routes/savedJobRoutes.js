const express = require("express");
const savedJobController = require("../controllers/savedJobController");
const { requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/saved-jobs", requireAuth, savedJobController.addSavedJob);
router.get("/saved-jobs", requireAuth, savedJobController.getSavedJobs);
router.delete("/saved-jobs/:id", requireAuth, savedJobController.deleteSavedJob);

module.exports = router;
