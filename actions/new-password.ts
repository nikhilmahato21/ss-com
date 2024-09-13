
"use server"

import * as z from "zod"

import { NewPasswordSchema } from "@/types/new-password-schema"
import { getPasswordResetTokenByToken } from "./tokens"
import  bcrypt  from 'bcryptjs';
import { db } from "@/lib/db"

export const newPassword = async(values:z.infer<typeof NewPasswordSchema>)=>{
    const validatedFields = NewPasswordSchema.safeParse(values)

    if(!validatedFields.success){
         return {error:"Invalid fields!"}
    }
  const {password,token}= validatedFields.data;

if(!token){
    return {error:"Missing Token"}
}
  
const existingToken = await getPasswordResetTokenByToken(token);

if(!existingToken){
    return {error:"Token not found"}
}
const hasExpired = new Date(existingToken.expires)< new Date()
  if(hasExpired){
    return {error:"Token has expired!"}
  }
  const existingUser = await db.user.findUnique({
    where:{
        email:existingToken.email,
    }
 })  
    
 if(!existingUser){
   return {error:"Email does not exist"}
 }
  const hashedPassword = await bcrypt.hash(password,10)
  await db.user.update({
    where:{id:existingUser.id},
    data:{
      password: hashedPassword,
      
    }
   })
  
  await db.passwordResetToken.delete({
    where:{id:existingToken.id}
  })
   return {success :"Password Updated!"}

}