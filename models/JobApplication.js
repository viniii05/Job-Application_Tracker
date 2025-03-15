const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const JobApplication = sequelize.define('JobApplication', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    companyName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    position: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('Applied', 'Interview Scheduled', 'Offer Received', 'Rejected'),
        allowNull: false,
        defaultValue: 'Applied'
    },
    applicationDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    followUpDate: {
        type: DataTypes.DATE,
        allowNull: true
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    attachmentUrl: { type: DataTypes.STRING }, // Store S3 URL

});

module.exports = JobApplication;
