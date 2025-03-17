const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
require('dotenv').config();
const SECRET_KEY = process.env.JWT_SECRET; 

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
            firstName, 
            lastName, 
            email,
            password: hashedPassword
        });

        res.status(201).json({ message: "User created successfully" });
    } catch (err) {
        console.error("Signup Error:", err); 
        res.status(400).json({ error: "Error creating user" });
    }
};


exports.postLoginData = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: "1h" });
        res.cookie("jwt", token, { 
            httpOnly: true, 
            maxAge: 3600000,
            secure: false, 
            sameSite: "Lax" 
        });
        res.json({ message: "Login successful", token });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

exports.logout = (req, res) => {
    res.cookie("jwt", "", { maxAge: 1 });
    res.json({ message: "Logged out" });
};
