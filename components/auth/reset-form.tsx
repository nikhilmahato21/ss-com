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

import { useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import { FormSuccess } from "./form-success";
import { FormError } from "./form-error";
import { ResetSchema } from "@/types/reset-schema";
import { reset } from "@/actions/password-reset";

export const ResetForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: "",
    },
  });
  const onSubmit = (values: z.infer<typeof ResetSchema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      reset(values).then((data) => {
        setError(data?.error);
        setSuccess(data?.success);
      });
    });
  };
  return (
    <div className="flex  mb-10">
      {" "}
      <AuthCard
        cardTitle="Forgot your password?"
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
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="nik@example.com"
                          type="email"
                          disabled={isPending}
                          autoComplete="email"
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
