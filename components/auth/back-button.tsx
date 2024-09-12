"use client"

import Link from "next/link"
import { Button } from "../ui/button"

type BackButtonType = {
    href:string
    label:string
}

export const BackButton = ({href,label}:BackButtonType) => {
  return (
    <Button asChild className="font-medium w-full" variant={"link"}>
      <Link href={href}>{label}</Link>
    </Button>
  )
}
