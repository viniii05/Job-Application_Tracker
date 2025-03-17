const nodemailer = require("nodemailer");
const JobApplication = require("../models/JobApplication");
const User = require("../models/User"); // Import User model
const { Op } = require("sequelize");

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS  // Your email password
    }
});

const sendReminderEmails = async () => {
    try {
        const today = new Date();
        const jobs = await JobApplication.findAll({
            where: {
                followUpDate: { [Op.lte]: today }
            },
            include: [{ model: User, attributes: ["email"] }] // Fetch user's email
        });

        for (const job of jobs) {
            if (!job.User || !job.User.email) {
                console.warn(`⚠️ No email found for job ID: ${job.id}`);
                continue; // Skip if user email is missing
            }

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: job.User.email, // Use the actual user’s email
                subject: "Job Application Follow-Up Reminder",
                text: `Reminder: Follow up on your application for ${job.position} at ${job.companyName}.`
            };

            await transporter.sendMail(mailOptions);
            console.log(`📧 Reminder sent to: ${job.User.email}`);
        }

        console.log("✅ All reminders processed!");
    } catch (error) {
        console.error("❌ Error Sending Emails:", error);
    }
};

module.exports = sendReminderEmails;
