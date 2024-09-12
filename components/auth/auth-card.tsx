import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Socials from "./socials";
import { BackButton } from "./back-button";


type CardWrapperProps = {
  children: React.ReactNode;
  cardTitle: string;
  backButtonHref: string;
  backButtonLabel: string;
  showSocials?: boolean;
};

export const AuthCard = ({
  children,
  cardTitle,
  backButtonHref,
  backButtonLabel,
  showSocials,
}: CardWrapperProps) => {
  return <Card className="lg:w-1/2 w-full lg:shadow-none lg:border-none" >
    <CardHeader>
        <CardTitle>{cardTitle}</CardTitle>
    </CardHeader>
    <CardContent>
        {children}
    </CardContent>
    {showSocials && (
        <CardFooter>
           <Socials/> 
        </CardFooter>
    )}
    <CardFooter>
        <BackButton href={backButtonHref}label={backButtonLabel}/>
    </CardFooter>
  </Card>;
};
