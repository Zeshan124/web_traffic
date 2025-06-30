import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import { v4 as uuidv4 } from "uuid";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async session({ session, token }: any) {
      if (token && session.user) {
        const userEmail = token.email || "";
        const userId = userEmail
          ? `auth_${userEmail.replace(/[^a-zA-Z0-9]/g, "_")}`
          : uuidv4();

        session.user.id = userId;
        session.user.email = token.email || null;
        session.user.name = token.name || null;
        session.user.image = token.picture || null;
        session.user.googleId = token.sub || "";
        session.user.loginTime = token.loginTime || new Date().toISOString();
      }
      return session;
    },
    async jwt({ token, user, account }: any) {
      if (account && user) {
        token.sub = user.id;
        token.email = user.email || undefined;
        token.name = user.name || undefined;
        token.picture = user.image || undefined;
        token.loginTime = new Date().toISOString();
      }
      return token;
    },
    async signIn({ user, account }: any) {
      console.log("User signed in:", {
        userId: user.id,
        email: user.email,
        name: user.name,
        provider: account?.provider,
      });
      return true;
    },
  },
  events: {
    async signIn({ user, account, isNewUser }: any) {
      console.log("Sign in event:", {
        userId: user.id,
        email: user.email,
        isNewUser,
        provider: account?.provider,
      });
    },
    async signOut({ session, token }: any) {
      console.log("Sign out event:", {
        userId: session?.user?.id || token?.sub,
      });
    },
  },
});

export { handler as GET, handler as POST };
