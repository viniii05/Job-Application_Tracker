const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    firstName: { // ✅ Fix: Use camelCase
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: { // ✅ Fix: Use camelCase
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    careerGoals: { type: DataTypes.TEXT, allowNull: true },
});

module.exports = User;
