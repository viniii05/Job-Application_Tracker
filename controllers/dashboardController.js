const path = require("path");

exports.showDashboard = (req, res) => {
    res.sendFile(path.join(__dirname, "../views/dashboard.html"));
};
