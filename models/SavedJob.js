const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const SavedJob = sequelize.define("SavedJob", {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    jobTitle: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    company: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    jobUrl: {
        type: DataTypes.STRING,
    },
    dateSaved: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
});

module.exports = SavedJob;
