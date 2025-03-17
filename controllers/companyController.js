const Company = require("../models/Company");

exports.addCompany = async (req, res) => {
    try {
        const { companyName, industry, companySize, location, notes } = req.body;
        const userId = req.user.id; 

        if (!companyName) {
            return res.status(400).json({ error: "Company name is required" });
        }

        const company = await Company.create({
            userId,
            companyName,
            industry,
            companySize,
            location,
            notes
        });

        res.status(201).json({ message: "Company added successfully", company });
    } catch (error) {
        console.error("Error adding company:", error);
        res.status(500).json({ error: "Server error" });
    }
};
exports.getCompanies = async (req, res) => {
    try {
        const userId = req.user.id;
        const companies = await Company.findAll({ where: { userId } });
        res.json(companies);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

exports.deleteCompany = async (req, res) => {
    try {
        const { id } = req.params;
        const company = await Company.findByPk(id);

        if (!company) return res.status(404).json({ error: "Company not found" });

        await company.destroy();
        res.json({ message: "Company deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};
