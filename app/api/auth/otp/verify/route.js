import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    // Parse the incoming request JSON
    const { otp, token } = await req.json();

    // Validate required fields
    if (!otp || !token) {
      return NextResponse.json({ error: "OTP and token are required" }, { status: 400 });
    }

    // Verify the JWT token using the server secret
    // This ensures the token is valid and has not expired
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Compare the OTP provided by the user with the one in the token
    if (decoded.otp !== otp) {
      return NextResponse.json({ error: "Incorrect OTP" }, { status: 401 });
    }

    // If everything checks out, return a success response
    return NextResponse.json({
      message: "OTP verified successfully",
      email: decoded.email, // useful if needed for user creation
    });

  } catch (error) {
    // Handle token expiration specifically
    if (error.name === "TokenExpiredError") {
      return NextResponse.json(
        { error: "OTP expired. Please request a new one." },
        { status: 401 }
      );
    }

    // Handle other token or decoding errors
    return NextResponse.json(
      { error: "Invalid token or OTP." },
      { status: 400 }
    );
  }
}
