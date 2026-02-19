const express = require('express');
const router = express.Namespace ? express.Namespace() : express.Router();
const {
    register,
    login,
    adminLogin,
    verifyOTP,
    resendOTP,
} = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/admin-login', adminLogin);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);

module.exports = router;
