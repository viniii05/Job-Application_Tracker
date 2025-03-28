const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
require('dotenv').config();
const SECRET_KEY = process.env.JWT_SECRET; // Change this in production

exports.showLoginPage = (req, res) => {
    res.sendFile(path.join(__dirname, "../views/login.html"));
};

exports.showSignupPage = (req, res) => {
    res.sendFile(path.join(__dirname, "../views/signup.html"));
};

exports.postSignupData = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            firstName, // ✅ Correct casing
            lastName, // ✅ Correct casing
            email,
            password: hashedPassword
        });

        res.status(201).json({ message: "User created successfully" });
    } catch (err) {
        console.error("Signup Error:", err);  // ✅ Log error in terminal
        res.status(400).json({ error: "Error creating user" });
    }
};


exports.postLoginData = async (req, res) => {
    const { email, password } = req.body;
    console.log("Login Attempt:", email, password); // ✅ Debugging

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            console.log("User not found"); // ✅ Debugging
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("Password mismatch"); // ✅ Debugging
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: "1h" });
        res.cookie("jwt", token, { httpOnly: true, maxAge: 3600000 });
        res.cookie("jwt", token, { 
            httpOnly: true,  // Prevent XSS attacks
            maxAge: 3600000, // 1 hour in ms
            secure: false,   // Set to `true` if using HTTPS
            sameSite: "Lax" 
        });
        res.json({ message: "Login successful", token });
    } catch (error) {
        console.error("Login Error:", error); // ✅ Debugging
        res.status(500).json({ error: "Server error" });
    }
};


// User Logout
exports.logout = (req, res) => {
    res.cookie("jwt", "", { maxAge: 1 });
    res.json({ message: "Logged out" });
};