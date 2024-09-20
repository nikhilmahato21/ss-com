import { auth } from "@/auth";
import SettingsCard from "@/components/settings-card";
import { redirect } from "next/navigation";

export default async function Settings() {
  const session = await auth();
  if (!session) redirect("/");

  if(session)return (
    <SettingsCard session={session}/>
  )
}
