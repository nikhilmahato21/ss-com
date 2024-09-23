import { Card, CardHeader } from "../ui/card"
import { AuthCard } from "./auth-card"




export const ErrorCard = ()=>{
    return <AuthCard
    cardTitle="Oops! Something went wrong!"
    backButtonHref="/auth/login"
    backButtonLabel="Back to login"
   
    
  >
    <h1></h1> 
  </AuthCard>
}