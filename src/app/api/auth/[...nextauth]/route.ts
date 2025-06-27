import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

// Type augmentation for custom fields
import 'next-auth';
declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    user: {
      id?: string;
      provider?: string;
      googleId?: string;
      verified_email?: boolean;
      locale?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}
declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string;
    provider?: string;
    googleId?: string;
    picture?: string;
    verified_email?: boolean;
    locale?: string;
    sub?: string;
  }
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.accessToken = account.access_token;
        token.provider = account.provider;
        token.googleId = account.providerAccountId;
        token.picture = (profile as any).picture;
        token.verified_email = (profile as any).verified_email;
        token.locale = (profile as any).locale;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string | undefined;
      if (session.user) {
        session.user.id = token.sub as string | undefined;
        session.user.provider = token.provider as string | undefined;
        session.user.googleId = token.googleId as string | undefined;
        session.user.verified_email = token.verified_email as boolean | undefined;
        session.user.locale = token.locale as string | undefined;
      }
      return session;
    },
  },
  events: {
    async signIn({ user, account, profile }) {
      console.log(`✅ User ${user.email} signed in with ${account?.provider}`);
    },
    async signOut({ session, token }) {
      console.log(`👋 User signed out`);
    },
  },
});

export { handler as GET, handler as POST };