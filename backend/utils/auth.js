const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

const hashPassword = async (password) => {
    return await bcrypt.hash(password, 12);
};

const verifyPassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

const generateToken = (userId, email, role) => {
    return jwt.sign({ userId, email, role }, JWT_SECRET, { expiresIn: "7d" });
};

const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
};

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

module.exports = {
    hashPassword,
    verifyPassword,
    generateToken,
    verifyToken,
    generateOTP,
};
