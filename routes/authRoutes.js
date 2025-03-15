const express = require("express");
const authController = require('../controllers/authController');

const router = express.Router();

router.get("/login.html", authController.showLoginPage);
router.get("/signup.html", authController.showSignupPage);

router.post('/signup', authController.postSignupData);
router.post('/login', authController.postLoginData);
router.get("/logout", authController.logout);
module.exports = router;
