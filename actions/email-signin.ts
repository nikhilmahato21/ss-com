"use server";
import { signIn } from "@/auth";
import { LoginSchema } from "@/types/login-schema";
import { AuthError } from "next-auth";
import * as z from "zod";
import { sendTwoFactorTokenEmail, sendVerificationEmail } from "./mail";
import {
  generateEmailVerificationToken,
  generateTwoFactorToken,
  getTwoFactorConfirmationByUserId,
  getTwoFactorTokenByEmail,
} from "./tokens";
import { db } from "@/lib/db";

export const emailSignIn = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }
  const { email, password, code } = validatedFields.data;

  try {
    const existingUser = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (!existingUser || !existingUser?.email || !existingUser.password) {
      return { error: "Email does not exist!" };
    }

    if (!existingUser.emailVerified) {
      const verificationToken = await generateEmailVerificationToken(email);
      await sendVerificationEmail(
        verificationToken.email,
        verificationToken.token
      );
      return { success: "Email confirmation sent" };
    }

    if (existingUser.isTwoFactorEnabled && existingUser.email) {

      if(code){
         const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email)
         if(!twoFactorToken){
          return {error:"Invalid code!"}
         }
         if(twoFactorToken.token!==code){
          return {error:"Invalid code!"}
         }
         const hasExpired = new Date(twoFactorToken.expires)<new Date()
         if(hasExpired){
           return {error:"Code expired!"}
         }
           await db.twoFactorToken.delete({
            where:{id:twoFactorToken.id}
           })
           const existingConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id)

           if(existingConfirmation){
            await db.twoFactorConfirmation.delete({
              where:{id:existingConfirmation.id}
            })
           }
            await db.twoFactorConfirmation.create({
              data:{
                userId:existingUser.id,
              }
            })
      }else{
        const twoFactorToken = await generateTwoFactorToken(existingUser.email);
        await sendTwoFactorTokenEmail(twoFactorToken.email,twoFactorToken.token)
  
        return {twoFactor:true}
      }
      
    }

    await signIn("credentials", {
      email,
      password,
      redirectTo: "/",
    });
    return { success: "User Signed In!" };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" };
        default:
          return { error: "something went wrong" };
      }
    }
    throw error;
  }
};
