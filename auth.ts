import NextAuth from "next-auth"
import bcrypt from "bcryptjs"
import Github from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import {PrismaAdapter} from "@auth/prisma-adapter"
import { db } from "./lib/db"
import { LoginSchema } from "./types/login-schema"
 
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
   }),
   Credentials({
    async authorize(credentials){
        const validatedFields = LoginSchema.safeParse(credentials)

        if(validatedFields.success){
            const {email,password} = validatedFields.data;
                 
            const user = await db.user.findUnique({
              where:{
                  email,
              }
            })  
         
           if(!user || !user.password)return null;
           

           const passwordMatch = await bcrypt.compare(password,user.password);

           if(passwordMatch)return user;
        }
        return null;
    }
})
  ],
   adapter:PrismaAdapter(db),
   session:{strategy:"jwt"},
})