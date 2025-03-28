import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from "@/lib/db"; // Your MySQL connection

export async function POST(request) {
    try {
        const body = await request.json();
        const { firstName, lastName, email, major, password } = body;

        if (!firstName || !lastName || !email || !major || !password) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        // Check if the email already exists
        const [existingUsers] = await db.execute('SELECT id FROM users WHERE email = ?', [email]);

        if (existingUsers.length > 0) {
            return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user into the database
        const query = `
            INSERT INTO users (first_name, last_name, email, major, password)
            VALUES (?, ?, ?, ?, ?)
        `;
        const values = [firstName, lastName, email, major, hashedPassword];

        const [result] = await db.execute(query, values);

        return NextResponse.json({ message: 'User created successfully', userId: result.insertId });
    } catch (error) {
        console.error('Signup Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
