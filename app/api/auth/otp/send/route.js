import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import { query } from "@/lib/db";

export async function POST(req) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    if (!/^\d+@students\.liu\.edu\.lb$/.test(email)) {
      return NextResponse.json({ error: "Invalid LIU student email." }, { status: 400 });
    }
//Check email and IP rate limits
    const emailAttemptsResult = await query(
      `SELECT COUNT(*) AS count FROM otp_requests WHERE email = ? AND timestamp > NOW() - INTERVAL 10 MINUTE`,
      [email]
    );
    const ipAttemptsResult = await query(
      `SELECT COUNT(*) AS count FROM otp_requests WHERE ip_address = ? AND timestamp > NOW() - INTERVAL 15 MINUTE`,
      [ip]
    );
    
    // Access the first row
    const emailAttempts = emailAttemptsResult[0]?.count || 0;
    const ipAttempts = ipAttemptsResult[0]?.count || 0;
    
    
    if (emailAttempts >= 3 || ipAttempts >=5) {//email limit is 3 per 10 minutes, IP limit is 5 per 15 minutes
      return NextResponse.json(
        { error: "Too many requests. Please wait a few minutes." },
        { status: 429 }
      );
    }
    

    // Check if email is already registered
    const [existingUser] = await query(`SELECT id FROM users WHERE email = ?`, [email]);
    if (existingUser) {
      return NextResponse.json({ error: "Email is already registered." }, { status: 409 });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpToken = jwt.sign({ email, otp }, process.env.JWT_SECRET, { expiresIn: "3m" });


    // Send email
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"LIU Community" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP Code",
      html: `
  <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 24px; border: 1px solid #eaeaea; border-radius: 8px; background-color: #f9f9f9;">
    <h2 style="text-align: center; color: #4B0082;">LIU Community Verification</h2>
    <p>Hello,</p>
    <p>Thank you for signing up to <strong>LIU Community</strong>. To verify your email address, please use the OTP code below:</p>
    <div style="font-size: 32px; font-weight: bold; color: #4B0082; text-align: center; margin: 20px 0;">${otp}</div>
    <p>This code will expire in <strong>3 minutes</strong>. If you did not request this, please ignore this email.</p>
    <hr style="margin: 24px 0;" />
    <p style="font-size: 12px; color: #888888;">This is an automated message. Please do not reply.</p>
    <p style="font-size: 12px; color: #888888;">&copy; ${new Date().getFullYear()} LIU Community</p>
  </div>
`
    };

    await transporter.sendMail(mailOptions);

    // Log this attempt
    await query(`INSERT INTO otp_requests (email, ip_address) VALUES (?, ?)`, [email, ip]);

    return NextResponse.json({ message: "OTP sent", token: otpToken });
  } catch (error) {
    console.error("OTP send error:", error);
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}
