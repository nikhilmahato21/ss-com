
"use server"

import { db } from "@/lib/db";
import { randomInt } from 'crypto';
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

export const newVerification = async (token:string)=>{
  const existingToken = await getVerificationTokenByToken(token)

  if(!existingToken){
    return {error:"Token does not exist!"}
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
    
 await db.user.update({
  where:{id:existingUser.id},
  data:{
    emailVerified: new Date(),
    email:existingToken.email
  }
 })

await db.verificationToken.delete({
  where:{id:existingToken.id}
})
 return {success :"Email verified!"}
}


export const getPasswordResetTokenByToken = async(token:string)=>{
  try {
    const passwordResetToken =  await db.passwordResetToken.findUnique({
        where: {
          token
        },
      });
      return passwordResetToken
  } catch (error) {
    console.log(error);
    return null
  }   
}
export const getPasswordResetTokenByEmail = async(email:string)=>{
  try {
    const passwordResetToken =  await db.passwordResetToken.findFirst({
        where: {
          email
        },
      });
      return passwordResetToken
  } catch (error) {
    console.log(error);
    return null
  }   
}

export const generatePasswordResetToken = async(email:string)=>{
  try {
    const token = crypto.randomUUID()
  const expires = new Date(new Date().getTime()+3600*1000)

  const existingToken = await getPasswordResetTokenByEmail(email)

  // Check if an existing token exists
if (existingToken) {
  await db.passwordResetToken.delete({
    where: {
      id: existingToken.id,
    },
  });
}

// Insert a new verification token
const passwordResetToken = await db.passwordResetToken.create({
  data: {
    email,      // or just 'email' with shorthand property notation
    token,        // or just 'token'
    expires   // or just 'expires'
  },
});

// Return the newly created verification token
return passwordResetToken;

  } catch (error) {
    return null
  }

}


export const getTwoFactorTokenByEmail = async(email:string)=>{
  try {
    const twoFactorToken =  await db.twoFactorToken.findFirst({
        where: {
          email
        },
      });
      return twoFactorToken
  } catch (error) {
    console.log(error);
    return null
  }   
}

export const getTwoFactorTokenByToken= async(token:string)=>{
  try {
    const twoFactorToken =  await db.twoFactorToken.findUnique({
        where: {
          token
        },
      });
      return twoFactorToken
  } catch (error) {
    console.log(error);
    return null
  }   
}

export const generateTwoFactorToken = async(email:string)=>{
  const token = randomInt(100000,1_000_000).toString();
  const expires = new Date(new Date().getTime()+3600*1000)
  const existingToken = await getTwoFactorTokenByEmail(email)
  if (existingToken) {
    await db.twoFactorToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }
  const twoFactorToken = await db.twoFactorToken.create({
    data:{
      email,
      token,
      expires
    }
  })
  return twoFactorToken
}

export const getTwoFactorConfirmationByUserId = async(userId:string)=>{


  try {
    const twoFactorConfirmation = await db.twoFactorConfirmation.findUnique({
      where:{userId}
    })
    return twoFactorConfirmation
  } catch (error) {
    return null;
  }

}