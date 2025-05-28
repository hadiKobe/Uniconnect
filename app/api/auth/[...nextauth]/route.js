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
   

          const [rows] = await db.execute(
            "SELECT id, email, password, first_name, last_name, major, joined_in, profile_picture,graduation_progress FROM users WHERE email = ? LIMIT 1",
            [email]
          );


          if (!rows || rows.length === 0) {
 
            throw new Error("User not found");
          }

          const user = rows[0];
          const isValid = await bcrypt.compare(password, user.password);

          if (!isValid) {
     
            throw new Error("Invalid credentials");
          }

  
          const graduationStatus = user.graduation_progress === 100 ? "Graduated" : "UnderGrad";
          return {
            id: user.id.toString(),
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            major: user.major,
            joined_in: user.joined_in,
            profile_picture: user.profile_picture,
            graduation_progress:graduationStatus,
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
  strategy: "jwt",
  maxAge: 60 * 60 * 24 * 7, // 7 days
}
,
  jwt: {
    encryption: false, 
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
        session.user.profile_picture = token.profile_picture || null; // ✅ Add this
        session.user.graduation_progress = token.graduation_progress || "UnderGrad"; // Default to "Undergraduate"
        
      }
      return session;
    },

    async jwt({ token, user }) {
      // Add extra fields to JWT
      if (user) {
        token.sub = user.id;
        token.major = user.major;
        token.joined_in = user.joined_in;
        token.profile_picture = user.profile_picture; 
        token.graduation_progress = user.graduation_progress || "UnderGrad"; // Default to "Undergraduate"
      }
      return token;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
