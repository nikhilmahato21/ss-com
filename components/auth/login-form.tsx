"use client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { AuthCard } from "./auth-card";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/types/login-schema";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Link from "next/link";
import { RightImage } from "./right-image";
import { useState, useTransition } from "react";
import { emailSignIn } from "@/actions/email-signin";
import { cn } from "@/lib/utils";
import { FormSuccess } from "./form-success";
import { FormError } from "./form-error";

export const LoginForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const form = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      emailSignIn(values).then((data) => {
        setError(data?.error);
        setSuccess(data?.success);
      });
    });
  };
  return (
    <div className="flex  mb-10">
      {" "}
      <AuthCard
        cardTitle="welcome back!"
        backButtonHref="/auth/register"
        backButtonLabel="Create a new account"
        showSocials
        additionalClass="lg:w-1/2 w-full lg:shadow-none lg:border-none"
      >
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="nik@gmail.com"
                          type="email"
                          autoComplete="email"
                        />
                      </FormControl>
                      <FormDescription />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="******"
                          type="password"
                          autoComplete="current-password"
                        />
                      </FormControl>
                      <FormDescription />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button size={"sm"} variant={"link"} asChild>
                  <Link href={"/auth/reset"}>Forgot Password?</Link>
                </Button>
              </div>
              <FormSuccess message={success} />
              <FormError message={error} />
              <Button
                type="submit"
                className={cn("w-full my-2", isPending ? "animate-pulse" : "")}
              >
                {"Login"}
              </Button>
            </form>
          </Form>
        </div>
      </AuthCard>
      <RightImage />
    </div>
  );
};
