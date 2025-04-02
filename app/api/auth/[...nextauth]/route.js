import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db"; // Your MySQL connection

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "your@email.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials;

        try {
          console.log("🔍 Checking user:", email);

          const [rows] = await db.execute(
            "SELECT * FROM users WHERE email = ? LIMIT 1",
            [email]
          );

          if (!rows || rows.length === 0) {
            console.log("❌ No user found");
            throw new Error("User not found");
          }

          const user = rows[0];
          const isValid = await bcrypt.compare(password, user.password);

          if (!isValid) {
            console.log("❌ Invalid password");
            throw new Error("Invalid credentials");
          }

          console.log("✅ Login success");

          return {
            id: user.id.toString(),
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            major: user.major,
            joined_in: user.joined_in,
          };
        } catch (error) {
          console.error("❌ Auth error:", error.message);
          throw new Error("Authentication failed");
        }
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: "jwt", // ✅ Required for middleware support
  },

  pages: {
    signIn: "/SignIn",
  },

  callbacks: {
    async session({ session, token }) {
      // Add extra fields to session
      if (session.user) {
        session.user.id = token.sub;
        session.user.major = token.major || "";
        session.user.joined_in = token.joined_in || "";
      }
      return session;
    },

    async jwt({ token, user }) {
      // Add extra fields to JWT
      if (user) {
        token.sub = user.id;
        token.major = user.major;
        token.joined_in = user.joined_in;
      }
      return token;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
