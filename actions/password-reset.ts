"use server"
import * as z from "zod"
import { ResetSchema } from "@/types/reset-schema"
import { db } from "@/lib/db"
import { generatePasswordResetToken } from "./tokens"
import { sendPasswordResetEmail } from "./mail"



export const reset = async(values:z.infer<typeof ResetSchema>)=>{
    const validatedFields = ResetSchema.safeParse(values)

    if(!validatedFields.success){
         return {error:"Invalid fields!"}
    }
  const {email}= validatedFields.data;

  const existingUser = await db.user.findUnique({
    where:{
        email
    }
 })   
 if(!existingUser){
   return {error:"User not found"}
 }


 const passwordResetToken = await generatePasswordResetToken(email)
 if(!passwordResetToken){
    return {error:"Token not generated"}
 }
 await sendPasswordResetEmail(passwordResetToken.email,passwordResetToken.token)

 return{success:"Reset email sent!"}

}