"use client"

import Link from "next/link"
import { Button } from "../ui/button"

type BackButtonType = {
    href:string
    label:string
}

export const BackButton = ({href,label}:BackButtonType) => {
  return (
    <Button className="font-medium w-full" variant={"link"}>
      <Link href={href}>{label}</Link>
    </Button>
  )
}
