"use server"

import { db } from "@/lib/db";

export const getVerificationTokenByToken = async(token:string)=>{
    try {
      const verificationToken =  await db.verificationToken.findUnique({
          where: {
            token
          },
        });
        return verificationToken
    } catch (error) {
      console.log(error);
      return null
    }   
  }
export const getVerificationTokenByEmail = async(email:string)=>{
  try {
    const verificationToken =  await db.verificationToken.findFirst({
        where: {
          email
        },
      });
      return verificationToken
  } catch (error) {
    console.log(error);
    return null
  }   
}

export const generateEmailVerificationToken = async(email:string)=>{
    const token = crypto.randomUUID()
    const expires = new Date(new Date().getTime()+3600*1000)

    const existingToken = await getVerificationTokenByEmail(email)

    // Check if an existing token exists
if (existingToken) {
    await db.verificationToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }
  
  // Insert a new verification token
  const verificationToken = await db.verificationToken.create({
    data: {
      email,      // or just 'email' with shorthand property notation
      token,        // or just 'token'
      expires   // or just 'expires'
    },
  });
  
  // Return the newly created verification token
  return verificationToken;
  
}