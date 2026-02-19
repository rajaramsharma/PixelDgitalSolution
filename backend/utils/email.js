const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

const sendOTPEmail = async (email, otp, name) => {
    try {
        const mailOptions = {
            from: `"Pixel Digital Solution" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Email Verification - OTP Code",
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome to Pixel Digital Solution!</h2>
          <p>Hi ${name},</p>
          <p>Thank you for registering with us. Please use the following OTP to verify your email address:</p>
          <div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
            <h1 style="color: #4CAF50; margin: 0; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
          </div>
          <p>This OTP will expire in 10 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #999; font-size: 12px;">© 2025 Pixel Digital Solution. All rights reserved.</p>
        </div>
      `,
        };

        await transporter.sendMail(mailOptions);
        return { success: true };
    } catch (error) {
        console.error("Email send error:", error);
        return { success: false, error: error.message };
    }
};

module.exports = { sendOTPEmail };
