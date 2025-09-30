const nodemailer = require("nodemailer");

const sendConfirmationEmail = async ({ name, email, tripDetails, type }) => {
try {
    let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    });

    await transporter.sendMail({
    from: `"One Sky Quest" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Booking Confirmation",
    text: `Hi ${name}, your ${type} booking has been confirmed!\n\nTrip Details:\n${tripDetails}\n\nThanks for using One Sky Quest!`,
    });

    console.log("📧 Confirmation email sent to", email);
} catch (error) {
    console.error("❌ Failed to send email:", error);
}
};

module.exports = sendConfirmationEmail;
