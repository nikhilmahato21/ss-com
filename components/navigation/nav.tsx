import { auth } from "@/auth";
import { UserButton } from "./user-button";
import { Button } from "../ui/button";
import Link from "next/link";
import { LogIn } from "lucide-react";
import Logo from "./logo";

export default async function Nav() {
  const session = await auth();

  return (
    <header className="py-4 ">
      <nav>
        <ul className="flex items-center justify-between">
          <li >
            <Link href={"/"}>
              <Logo />
            </Link>
          </li>
          {!session ? (
            <li>
              <Button asChild>
                <Link className="flex gap-2" href="/auth/login">
                  <LogIn size={16} /> <span>Login</span>{" "}
                </Link>
              </Button>
            </li>
          ) : (
            <li>
              <UserButton expires={session?.expires} user={session?.user} />
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}
