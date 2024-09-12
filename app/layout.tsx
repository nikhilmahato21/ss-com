import type { Metadata } from "next";
import {Inter } from "next/font/google"
import Nav from "@/components/navigation/nav";
import { cn } from "@/lib/utils";
import "./globals.css"

const inter = Inter({subsets:["latin"]})



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
      <body className={cn('px-6 md:px-12 max-w-7xl mx-auto',`${inter.className}`)}>
        <Nav/>
        {children}
      </body>
    </html>
  );
}
