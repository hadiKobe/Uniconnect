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
      html: `<div>Use this code: <strong>${otp}</strong>. It expires in 3 minutes.</div>`,
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
