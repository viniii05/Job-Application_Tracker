const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Company = sequelize.define("Company", {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    companyName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    industry: {
        type: DataTypes.STRING,
    },
    companySize: {
        type: DataTypes.STRING,
    },
    location: {
        type: DataTypes.STRING,
    },
    notes: {
        type: DataTypes.TEXT,
    },
});

module.exports = Company;
