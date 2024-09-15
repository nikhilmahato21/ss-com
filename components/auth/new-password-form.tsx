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
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Link from "next/link";
import { RightImage } from "./right-image";
import { useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import { FormSuccess } from "./form-success";
import { FormError } from "./form-error";
import { NewPasswordSchema } from "@/types/new-password-schema";
import { newPassword } from "@/actions/new-password";
import { useRouter, useSearchParams } from "next/navigation";

export const NewPasswordForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const token = useSearchParams().get("token");
  const router= useRouter()
  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
    },
  });
  
  const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      newPassword({password:values.password,token}).then((data) => {
        setError(data?.error);
        setSuccess(data?.success);
        router.push('/auth/login')
      });
    });
  };
  return (
    <div className="flex  mb-10">
      {" "}
      <AuthCard
        cardTitle="Enter a new password"
        backButtonHref="/auth/login"
        backButtonLabel="Back to login"
        additionalClass=" w-full"
      >
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div>
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
                          disabled={isPending}
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
                {"Reset Password"}
              </Button>
            </form>
          </Form>
        </div>
      </AuthCard>
    </div>
  );
};
