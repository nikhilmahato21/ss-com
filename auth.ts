import { getTwoFactorConfirmationByUserId } from './actions/tokens';
import NextAuth from "next-auth";
import bcrypt from "bcryptjs";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "./lib/db";
import { LoginSchema } from "./types/login-schema";
import { UserRole } from "@prisma/client";

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages:{
   signIn:"/auth/login",
   error:"/auth/error"
  },
  callbacks: {
    async signIn({ user, account }) {
      // Check if the user signed up using credentials
      const dbUser = await db.user.findUnique({
        where: { email: user.email ?? undefined, },
      });

    if(dbUser?.isTwoFactorEnabled){
      const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(dbUser.id)
      if(!twoFactorConfirmation){
        return false
      }
      
    }
      

      // If the user signed up with credentials and is now trying to link OAuth, block it
      if (dbUser?.password && account?.provider !== "credentials") {
        return `/auth/login?error=account_linking_blocked`; 
      }

      return true; // Allow sign-in
    },
    async session({ session, token }) {
      if (session && token.sub) {
        session.user.id = token.sub;
      }
      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }
      if (session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
        session.user.name = token.name;
        session.user.email = token.email as string;
        session.user.isOAuth = token.isOAuth as boolean;
        session.user.image = token.image as string;
      }
      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;
      const existingUser = await db.user.findFirst({
        where: {
          id: token.sub,
        },
      });
      if (!existingUser) return token;
      const existingAccount = await db.account.findFirst({
        where: {
          userId: existingUser.id,
        },
      });
      token.isOAuth = !!existingAccount && existingAccount.provider !== "credentials";
      token.role = existingUser.role;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;
      token.image = existingUser.image;
      return token;
    },
    
  },
  

  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Github({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          const user = await db.user.findUnique({
            where: {
              email,
            },
          });

          if (!user || !user.password) return null;

          const passwordMatch = await bcrypt.compare(password, user.password);

          if (passwordMatch) return user;
        }
        return null;
      },
    }),
  ],
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
});
