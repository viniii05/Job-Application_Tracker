const User = require("../models/User");

exports.getUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, { attributes: ["firstName", "lastName", "email", "careerGoals"] });
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { firstName, lastName, careerGoals } = req.body;
        const user = await User.findByPk(req.user.id);
        if (!user) return res.status(404).json({ error: "User not found" });

        user.firstName = firstName;
        user.lastName = lastName;
        user.careerGoals = careerGoals;
        await user.save();

        res.json({ message: "Profile updated successfully" });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};