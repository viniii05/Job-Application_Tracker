const SavedJob = require("../models/SavedJob");

exports.addSavedJob = async (req, res) => {
    try {
        const { jobTitle, company, jobUrl } = req.body;
        const userId = req.user.id;

        const savedJob = await SavedJob.create({
            userId, jobTitle, company, jobUrl
        });

        res.status(201).json({ message: "Job saved successfully", savedJob });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

exports.getSavedJobs = async (req, res) => {
    try {
        const userId = req.user.id;
        const savedJobs = await SavedJob.findAll({ where: { userId } });
        res.json(savedJobs);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

exports.deleteSavedJob = async (req, res) => {
    try {
        const { id } = req.params;
        const savedJob = await SavedJob.findByPk(id);

        if (!savedJob) return res.status(404).json({ error: "Saved job not found" });

        await savedJob.destroy();
        res.json({ message: "Saved job deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};