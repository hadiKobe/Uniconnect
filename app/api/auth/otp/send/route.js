import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    // Parse JSON body to extract email
    const { email } = await req.json();

    // Validate that email exists
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Generate a 6-digit numeric OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Create a signed JWT token containing the OTP and email
    // The token will expire in 2 minutes
    const otpToken = jwt.sign({ email, otp }, process.env.JWT_SECRET, {
      expiresIn: "2m",
    });

    // Create a Nodemailer transporter using Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER, // Sender email
        pass: process.env.EMAIL_PASS, // Sender app password
      },
    });

    // Email message content
    const mailOptions = {
        from: `"LIU Community" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Your One-Time Password (OTP) Code",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border-radius: 8px; border: 1px solid #e0e0e0;">
            <h2 style="color: #333;">Verify Your Email</h2>
            <p style="font-size: 15px; color: #555;">
              Thank you for signing up to LIU Community. Please use the following one-time password (OTP) to verify your email address:
            </p>
            <div style="font-size: 32px; font-weight: bold; margin: 20px 0; color: #1a73e8;">
              ${otp}
            </div>
            <p style="font-size: 14px; color: #888;">
              This code will expire in 5 minutes. If you did not request this, please ignore this email.
            </p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
            <p style="font-size: 13px; color: #aaa; text-align: center;">
              &copy; ${new Date().getFullYear()} LIU Community. All rights reserved.
            </p>
          </div>
        `,
      };
      

    // Send the email
    await transporter.sendMail(mailOptions);

    // Respond with success and the token
    return NextResponse.json({
      message: "OTP sent successfully",
      token: otpToken,
    });
  } catch (error) {
    console.error("OTP sending failed:", error);

    // Handle and return any server-side errors
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}
