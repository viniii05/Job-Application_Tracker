const JobApplication = require('../models/JobApplication');
const { Op } = require("sequelize");

exports.addJob = async (req, res) => {
    try {
        const { companyName, position, status, applicationDate, followUpDate, notes } = req.body;
        const userId = req.user.id; // Get logged-in user ID from JWT
        const attachmentUrl = req.file ? req.file.location : null;

        const job = await JobApplication.create({
            userId,
            companyName,
            position,
            status,
            applicationDate,
            followUpDate,
            notes,
            attachmentUrl,
        });

        res.status(201).json({ message: "Job added successfully", job });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

exports.getAllJobs = async (req, res) => {
    try {
        const userId = req.user.id;
        const jobs = await JobApplication.findAll({ where: { userId } });
        res.json({ jobs }); // ✅ CORRECT FORMAT
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};
exports.getFilteredjobs = async (req, res) => {
    try {
        const userId = req.user.id;
        const { search, status } = req.query;
        
        let whereClause = { userId };
        
        if (search) {
            whereClause[Op.or] = [
                { companyName: { [Op.iLike]: `%${search}%` } },
                { position: { [Op.iLike]: `%${search}%` } }
            ];
        }

        if (status) {
            whereClause.status = status;
        }

        const jobs = await JobApplication.findAll({ where: whereClause });
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};


exports.updateJob = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        const job = await JobApplication.findByPk(id);
        if (!job) return res.status(404).json({ error: "Job not found" });

        await job.update(updatedData);
        res.json({ message: "Job updated successfully", job });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

exports.deleteJob = async (req, res) => {
    try {
        const { id } = req.params;

        const job = await JobApplication.findByPk(id);
        if (!job) return res.status(404).json({ error: "Job not found" });

        await job.destroy();
        res.json({ message: "Job deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

exports.getReminders = async (req, res) => {
    try {
        const today = new Date();
        const userId = req.user.id;

        const reminders = await JobApplication.findAll({
            where: {
                userId,
                followUpDate: { [Op.lte]: today }
            }
        });

        res.json(reminders);
    } catch (error) {
        console.error("❌ Error fetching reminders:", error); // <== Add this line

        res.status(500).json({ error: "Server error" });
    }
};
exports.getJobStats = async (req, res) => {
    try {
        const userId = req.user.id;

        const totalApplications = await JobApplication.count({ where: { userId } });
        const interviewScheduled = await JobApplication.count({ where: { userId, status: "Interview Scheduled" } });
        const offerReceived = await JobApplication.count({ where: { userId, status: "Offer Received" } });
        const rejected = await JobApplication.count({ where: { userId, status: "Rejected" } });

        res.json({ totalApplications, interviewScheduled, offerReceived, rejected });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};