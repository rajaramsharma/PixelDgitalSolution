const User = require('../models/User');
const Admin = require('../models/Admin');
const { hashPassword, verifyPassword, generateToken, generateOTP } = require('../utils/auth');
const { sendOTPEmail } = require('../utils/email');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: "Please provide all required fields" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User with this email already exists" });
        }

        const hashedPassword = await hashPassword(password);
        const otp = generateOTP();
        const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            phone,
            otp: {
                code: otp,
                expiresAt: otpExpiresAt,
            },
        });

        await sendOTPEmail(email, otp, name);

        res.status(201).json({
            success: true,
            message: "Registration successful! Please check your email for OTP verification.",
            userId: user._id,
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ error: "Registration failed. Please try again." });
    }
};

// @desc    Authenticate a user or admin
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Please provide email and password" });
        }

        // 1. Check Admin Collection (Prioritize Admin access)
        let user = await Admin.findOne({ email });
        let isUser = false;

        // 2. If not found in Admin, check User Collection
        if (!user) {
            user = await User.findOne({ email });
            isUser = true;
        }

        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // 3. User-specific checks (e.g. Email Verification)
        // Admin doesn't need email verification in this schema context
        if (isUser && !user.isVerified) {
            return res.status(401).json({ error: "Please verify your email first" });
        }

        // 4. Verify Password
        const isPasswordValid = await verifyPassword(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // 5. Generate Token
        // Explicitly set role based on which collection we found the user in
        const role = isUser ? "user" : "admin";

        const token = generateToken(user._id, user.email, role);

        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: role,
            },
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Login failed. Please try again." });
    }
};

// @desc    Authenticate an admin
// @route   POST /api/auth/admin-login
// @access  Public
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Please provide email and password" });
        }

        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.status(401).json({ error: "Invalid administrative credentials" });
        }

        const isPasswordValid = await verifyPassword(password, admin.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid administrative credentials" });
        }

        const token = generateToken(admin._id, admin.email, "admin");

        res.json({
            success: true,
            token,
            user: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: "admin",
            },
        });
    } catch (error) {
        console.error("Admin Login error:", error);
        res.status(500).json({ error: "Administrative login failed." });
    }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (user.isVerified) {
            return res.status(400).json({ error: "Email already verified" });
        }

        if (!user.otp || user.otp.code !== otp) {
            return res.status(400).json({ error: "Invalid OTP" });
        }

        if (new Date() > user.otp.expiresAt) {
            return res.status(400).json({ error: "OTP has expired" });
        }

        user.isVerified = true;
        user.otp = undefined;
        await user.save();

        const token = generateToken(user._id, user.email, user.role);

        res.json({
            success: true,
            message: "Email verified successfully!",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("OTP verification error:", error);
        res.status(500).json({ error: "Verification failed. Please try again." });
    }
};

// @desc    Resend OTP
// @route   POST /api/auth/resend-otp
// @access  Public
const resendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (user.isVerified) {
            return res.status(400).json({ error: "Email already verified" });
        }

        const otp = generateOTP();
        const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

        user.otp = {
            code: otp,
            expiresAt: otpExpiresAt,
        };
        await user.save();

        await sendOTPEmail(email, otp, user.name);

        res.json({
            success: true,
            message: "OTP resent successfully! Please check your email.",
        });
    } catch (error) {
        console.error("Resend OTP error:", error);
        res.status(500).json({ error: "Failed to resend OTP. Please try again." });
    }
};

module.exports = {
    register,
    login,
    adminLogin,
    verifyOTP,
    resendOTP,
};
