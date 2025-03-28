const JobApplication = require('../models/JobApplication');
const { Op } = require("sequelize");

exports.addJob = async (req, res) => {
    try {
        console.log("Received job data:", req.body);

        const { companyName, position, maxSalary, location, status, applicationDate, followUpDate, notes } = req.body;
        const userId = req.user.id;
        const attachmentUrl = req.file?.location || null;

        if (!companyName || !position || !applicationDate) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Validate and format dates
        const formattedApplicationDate = applicationDate ? new Date(applicationDate) : null;
        const formattedFollowUpDate = followUpDate ? new Date(followUpDate) : null;

        // Check if date conversion resulted in 'Invalid Date'
        if (isNaN(formattedApplicationDate.getTime())) {
            return res.status(400).json({ error: "Invalid application date format" });
        }

        if (formattedFollowUpDate && isNaN(formattedFollowUpDate.getTime())) {
            return res.status(400).json({ error: "Invalid follow-up date format" });
        }

        const job = await JobApplication.create({
            userId,
            companyName,
            position,
            maxSalary: maxSalary ? parseFloat(maxSalary) : null, // Ensure number format
            location,
            status,
            applicationDate: formattedApplicationDate, // Save valid date
            followUpDate: formattedFollowUpDate, // Save valid date or null
            notes,
            attachmentUrl,
        });

        res.status(201).json({ message: "Job added successfully", job });
    } catch (error) {
        console.error("Error in addJob:", error);
        res.status(500).json({ error: "Server error", details: error.message });
    }
};


exports.getAllJobs = async (req, res) => {
    try {
        const userId = req.user.id;
        const jobs = await JobApplication.findAll({ where: { userId } });
        res.json({ jobs }); // CORRECT FORMAT
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
        console.error("Error fetching reminders:", error);

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