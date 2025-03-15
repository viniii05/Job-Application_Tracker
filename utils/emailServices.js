const nodemailer = require("nodemailer");
const JobApplication = require("../models/JobApplication");
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
            }
        });

        for (const job of jobs) {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: "user@example.com", // Replace with actual user email
                subject: "Job Application Follow-Up Reminder",
                text: `Reminder: Follow up on your application for ${job.position} at ${job.companyName}.`
            };

            await transporter.sendMail(mailOptions);
        }

        console.log("📧 Reminder emails sent!");
    } catch (error) {
        console.error("❌ Error Sending Emails:", error);
    }
};

module.exports = sendReminderEmails;
