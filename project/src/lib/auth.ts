import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { ConnectionDb } from "./db";
import { User } from "@/model/user.model";
import bcrypt from "bcryptjs";
import { DefaultSession } from "next-auth";
import Google from "next-auth/providers/google";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}
export const authOption: NextAuthOptions = {
  // Providers: login ke methods define karne ke liye
  providers: [
    // credential authentication
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;

        if (!email || !password) {
          throw new Error("Email and password are required.");
        }

        await ConnectionDb();

        const existingUser = await User.findOne({ email });
        if (!existingUser) {
          throw new Error("User not found, please register first.");
        }

        const isMatchPassword = await bcrypt.compare(
          password,
          existingUser.password,
        );
        if (!isMatchPassword) {
          throw new Error("Invalid password.");
        }

        // NextAuth ko string format mein ID chahiye hoti hai
        return {
          id: existingUser._id.toString(),
          email: existingUser.email,
          name: existingUser.name,
          image: existingUser.image,
        };
      },
    }),

    // google authentication
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],

  // Callbacks: Token aur Session manage karne ke liye
  callbacks: {
    async signIn({ account, user }) {
      if (account?.provider === "google") {
        await ConnectionDb();
        let existingUser = await User.findOne({ email: user.email });
        if (!existingUser) {
          existingUser = await User.create({
            name: user?.name,
            email: user?.email,
          });
        }
        user.id = existingUser._id.toString();
      }
      return true;
    },

    // 1. Authorize se data pehle JWT token mein aata hai
    async jwt({ token, user, trigger, session: updatedSession }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.image = user.image;
      }
      // Handle session update from client (e.g., after editing profile)
      if (trigger === "update" && updatedSession) {
        if (updatedSession.name) token.name = updatedSession.name;
        if (updatedSession.image !== undefined)
          token.image = updatedSession.image;
      }
      return token;
    },

    // 2. JWT token se data Session object mein jata hai
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.image as string;
      }
      return session;
    },
  },

  // Custom login/error pages ke liye (abhi empty hai)
  pages: {
    signIn: "/login",
    error: "/login",
  },
  // Session strategy define karna zaroori hai credentials ke liye
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  },

  // Environment variable se secret uthayein
  secret: process.env.NEXTAUTH_SECRET,
};

export default authOption;
