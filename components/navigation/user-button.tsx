"use client";

import { signOut } from "next-auth/react";
import { Session } from "next-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { LogOut, Moon, Settings, Sun, Truck, TruckIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";
import { Switch } from "../ui/switch";
import { set } from "zod";

export const UserButton = ({ user }: Session) => {
  const {setTheme,theme} = useTheme()
  const[checked,setChecked] = useState(false)

function setSwitchState(){
   switch (theme){
     case "dark":return setChecked(true)
     case "light":return setChecked(false)
     case "system":return setChecked(false)
   }
}


  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger>
        <Avatar>
          {user?.image && (
            <Image src={user.image} alt={user.image!} fill={true} />
          )}
          {!user?.image && (
            <AvatarFallback className="bg-primary/10">
              <div className="font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            </AvatarFallback>
          )}
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 p-6" align="end">
        <div className="mb-4 p-4  gap-1 flex flex-col items-center rounded-lg bg-primary/25">
          {user?.image && (
            <Image
              src={user?.image}
              alt={user.image!}
              className="rounded-full"
              width={36}
              height={36}
            />
          )}
          <p className="font-bold text-xs">{user?.name}</p>
          <span className="text-xs font-md text-secondary-foreground">
            {user?.email}
          </span>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="py-2 group font-medium cursor-pointer transition-all duration-500 ease-in-out  ">
          {" "}
          <TruckIcon
            size={14}
            className=" mr-3 group-hover:translate-x-1 transition-all duration-300 ease-in-out"
          />{" "}
          My orders
        </DropdownMenuItem>

        <DropdownMenuItem className="py-2 group font-medium cursor-pointer transition-all duration-500 ease-in-out ">
          {" "}
          <Settings
            size={14}
            className="mr-3 group-hover:rotate-180 transition-all duration-300  ease-in-out"
          />{" "}
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem className="py-2 font-medium cursor-pointer transition-all duration-500 ease-in-out">
          <div onClick={(e)=>e.stopPropagation()} className="flex items-center group">
            <Sun className="group-hover:text-yellow-600 dark:hidden group-hover:rotate-180 dark:-rotate-90 transition-all duration-500 ease-in-out mr-3 " size={14} />
            <Moon className="group-hover:text-blue-400 mr-3 dark:block hidden group-hover:-rotate-12 transition-all duration-300 ease-in-out " size={14} />
            <p className=" capitalize dark:text-blue-400 text-secondary-foreground/75  text-yellow-600">
              {theme} mode
            </p>
            <Switch className="scale-75 ml-3" checked={checked} onCheckedChange={(e)=>{
              setChecked((prev)=>!prev)
              if(e) setTheme("dark")
                if(!e) setTheme("light")
            }}/>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => signOut()}
          className="py-2 group focus:bg-destructive/30  font-medium cursor-pointer transition-all duration-500"
        >
         <LogOut size={14} className="mr-3 group-hover:scale-90 transition-all duration-300  ease-in-out"/> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
