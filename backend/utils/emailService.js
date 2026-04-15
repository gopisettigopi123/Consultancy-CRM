const nodemailer = require('nodemailer');

/**
 * Sends a password reset OTP to the user's email.
 */
const sendResetOTP = async (email, otp) => {
    // Console log just for fallback debugging
    console.log(`[Email Service] Attempting to send real OTP to ${email}`);

    const transporter = nodemailer.createTransport({
        service: 'gmail', // Standard configuration for Gmail
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: `"CRM Security" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Your CRM Password Reset OTP',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #4f46e5; text-align: center;">Account Recovery</h2>
                <p style="font-size: 16px; color: #333;">Hello,</p>
                <p style="font-size: 16px; color: #333;">We received a request to reset the password for your CRM account. Here is your One-Time Password (OTP):</p>
                <div style="text-align: center; margin: 30px 0;">
                    <span style="display: inline-block; padding: 15px 30px; font-size: 28px; font-weight: bold; color: #fff; background-color: #4f46e5; border-radius: 8px; letter-spacing: 5px;">
                        ${otp}
                    </span>
                </div>
                <p style="font-size: 14px; color: #666; text-align: center;">This code will expire in <strong>10 minutes</strong>.</p>
                <p style="font-size: 14px; color: #999; margin-top: 40px; border-top: 1px solid #eee; padding-top: 20px;">If you did not request a password reset, please ignore this email or contact your administrator.</p>
            </div>
        `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`[Email Service] Email sent successfully to ${email}`);
    return true;
};

module.exports = {
    sendResetOTP
};
