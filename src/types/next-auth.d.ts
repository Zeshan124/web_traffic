import { Account, Profile } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      googleId?: string;
      loginTime?: string;
    };
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    loginTime?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    sub?: string;
    email?: string;
    name?: string;
    picture?: string;
    loginTime?: string;
  }
}

export interface AuthCallbacks {
  session: {
    session: Session;
    token: JWT;
    user: User;
  };
  jwt: {
    token: JWT;
    user: User;
    account: Account | null;
    profile?: Profile;
    trigger?: "signIn" | "signUp" | "update";
  };
  signIn: {
    user: User;
    account: Account | null;
    profile?: Profile;
    email?: { verificationRequest?: boolean };
    credentials?: Record<string, unknown>;
  };
}

export interface AuthEvents {
  signIn: {
    user: User;
    account: Account | null;
    profile?: Profile;
    isNewUser?: boolean;
  };
  signOut: {
    session: Session;
    token: JWT;
  };
}