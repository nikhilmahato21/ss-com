import NextAuth from "next-auth"
import Github from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import {PrismaAdapter} from "@auth/prisma-adapter"
import { db } from "./lib/db"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google({
    clientId:process.env.GOOGLE_CLIENT_ID,
    clientSecret:process.env.GOOGLE_CLIENT_SECRET,
    allowDangerousEmailAccountLinking:true
   }),
   Github({
     clientId :process.env.GITHUB_CLIENT_ID, 
     clientSecret:process.env.GITHUB_CLIENT_SECRET,
     allowDangerousEmailAccountLinking:true
   }),],
   adapter:PrismaAdapter(db),
   session:{strategy:"jwt"},
})