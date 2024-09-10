import type { Metadata } from "next";
import "./globals.css";

import Nav from "@/components/navigation/nav";



export const metadata: Metadata = {
  title: "Sprout & Scribble",
  description: "Ecommerce for accessories",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  
  return (
    <html lang="en">
      <body
        
      >
        <Nav/>
        {children}
      </body>
    </html>
  );
}
