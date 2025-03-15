const express = require('express');
const jobController = require('../controllers/jobController');
const { requireAuth } = require('../middleware/authMiddleware');
const { upload, uploadToS3 } = require("../middleware/upload");

const router = express.Router();

router.post('/jobs', requireAuth, jobController.addJob);
router.get('/jobs', requireAuth, jobController.getAllJobs);
router.put('/jobs/:id', requireAuth, jobController.updateJob);
router.delete('/jobs/:id', requireAuth, jobController.deleteJob);
router.get('/jobs/reminders', requireAuth, jobController.getReminders);
router.get("/jobs/stats", requireAuth, jobController.getJobStats);
router.get("/jobs", requireAuth, jobController.getFilteredjobs);

router.post("/jobs/upload", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No file uploaded" });

        const fileUrl = await uploadToS3(req.file);
        res.status(201).json({ fileUrl });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
