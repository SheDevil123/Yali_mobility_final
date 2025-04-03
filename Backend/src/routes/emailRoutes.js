const express = require("express");
const nodemailer = require("nodemailer");
require("dotenv").config(); // Load environment variables

const router = express.Router();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER, // Set in .env file
        pass: process.env.EMAIL_PASS  // Set in .env file
    }
});

router.post("/send", async (req, res) => {
    const { to, cc, subject, content } = req.body;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: to,
        cc: cc,
        subject: subject,
        text: content
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: "Email sent successfully!" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
