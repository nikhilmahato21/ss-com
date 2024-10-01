import {Resend} from "resend"

const resend = new Resend(process.env. RESEND_API_KEY)



export const sendTwoFactorTokenEmail = async(email:string,token:string)=>{
    await resend.emails.send({
        from:"onboarding@resend.dev",
        to:email,
        subject:"Sproud and Scribble - Confirmation Code ",
        html: `<p>Your confirmation code ${token} </p>`,
    })
}




export const sendVerificationEmail = async(email:string,token:string)=>{
    const confirmLink = `http://localhost:3000/auth/new-verification?token=${token}`

    await resend.emails.send({
        from:"onboarding@resend.dev",
        to:email,
        subject:"Sproud and Scribble - Confirmation Email ",
        html: `<p>Click to <a href='${confirmLink}'>confirm your email</a></p>`,
    })
}
export const sendPasswordResetEmail = async(email:string,token:string)=>{
    const confirmLink = `http://localhost:3000/auth/new-password?token=${token}`

    await resend.emails.send({
        from:"onboarding@resend.dev",
        to:email,
        subject:"Sproud and Scribble - Confirmation Email ",
        html: `<p>Click here to <a href='${confirmLink}'>Reset your password</a></p>`,
    })
}