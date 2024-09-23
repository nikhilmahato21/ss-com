"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Session } from "next-auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { SettingsSchema } from "@/types/settings-schema";
import { useState, useTransition } from "react";
import Image from "next/image";
import { Switch } from "./ui/switch";
import { FormError } from "./auth/form-error";
import { FormSuccess } from "./auth/form-success";
import { settings } from "@/actions/settings";
import { cn } from "@/lib/utils";

type SettingsForm = {
  session: Session;
};

export default function SettingsCard(session: SettingsForm) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [avatarUploading, setAvatarUploading] = useState();
  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      password: undefined,
      newPassword: undefined,
      image: session.session.user?.image || undefined,
      name: session.session.user?.name || undefined,
      email: session.session.user?.email || undefined,
      isTwoFactorEnabled: session.session.user?.isTwoFactorEnabled || undefined,
    },
  });
  
  // console.log(session.session.user);
  
     
  const onSubmit = (values: z.infer<typeof SettingsSchema>) => {

    setError("");
    setSuccess("");
    startTransition(() => {
      settings(values).then((data) => {
        setError(data?.error);
        setSuccess(data?.success);
      });
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Settings</CardTitle>
        <CardDescription>Update your account settings</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="nik"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Avatar</FormLabel>
                  <div className="flex items-center gap-4">
                    {!form.getValues("image") && (
                      <div className="font-bold">
                        {session.session.user?.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    {form.getValues("image") && (
                      <Image
                        className="rounded-full"
                        src={form.getValues("image")!}
                        width={42}
                        height={42}
                        alt="user image"
                      />
                    )}
                  </div>
                  <FormControl>
                    <Input
                      type="hidden"
                      placeholder="avatar"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            {!session.session.user.isOAuth && (
              <>
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="*******"
                          {...field}
                          disabled={isPending}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>

                      <FormControl>
                        <Input
                          type="password"
                          placeholder="********"
                          {...field}
                          disabled={isPending}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isTwoFactorEnabled"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Two Factor Authentication</FormLabel>
                      <FormDescription>
                        Enable two factor Authentication for your account
                      </FormDescription>
                      <FormControl>
                        <Switch
                          disabled={
                            isPending 
                          }
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <FormError message={error} />
            <FormSuccess message={success} />
            <Button className={cn(" my-2", isPending ? "animate-pulse" : "")} disabled={isPending || avatarUploading} type="submit">
              Update your settings
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
