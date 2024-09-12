"use server";

import * as z from "zod"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db";


import { RegisterSchema } from "@/types/regisrer-schema";
import { generateEmailVerificationToken } from "./tokens";
import { sendVerificationEmail } from "./mail";


export const register = async (values: z.infer<typeof RegisterSchema>)=>{
    const validatedFields = RegisterSchema.safeParse(values)

     if(!validatedFields.success){
          return {error:"Invalid fields!"}
     }
     const {email,password,name}= validatedFields.data
     const hashedPassword = await bcrypt.hash(password,10)
     
     const existingUser = await db.user.findUnique({
        where:{
            email,
        }
     })  

     if(existingUser){

        if(!existingUser.emailVerified){
            const verificationToken = await generateEmailVerificationToken(email)
            await sendVerificationEmail(verificationToken.email,verificationToken.token)
            return {success:"Email Confirmation resent"}
        }
        return{error:"Email already in use !"}
     }
     await db.user.create({
        data:{
            name,
            email,
            password:hashedPassword
        },
     });

     const verificationToken = await generateEmailVerificationToken(email)
     await sendVerificationEmail(verificationToken.email,verificationToken.token)

    return {success:'Confirmation email sent!'}
}