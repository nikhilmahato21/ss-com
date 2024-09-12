"use server"
import { LoginSchema } from "@/types/login-schema"
import * as z from "zod"





export const emailSignIn = async(values:z.infer<typeof LoginSchema>)=>{
    const validatedFields = LoginSchema.safeParse(values)
     console.log(validatedFields);
     
   return {validatedFields}
   
}
  

