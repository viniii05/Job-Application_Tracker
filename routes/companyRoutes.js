const express = require("express");
const companyController = require("../controllers/companyController");
const { requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/companies", requireAuth, companyController.addCompany);
router.get("/companies", requireAuth, companyController.getCompanies);
router.delete("/companies/:id", requireAuth, companyController.deleteCompany);

module.exports = router;
