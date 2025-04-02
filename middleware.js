
import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/SignIn", // Redirect if not authenticated
  },
});

export const config = {
  matcher: [
    "/", // protect homepage
  ],
};
