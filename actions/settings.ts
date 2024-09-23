"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { SettingsSchema } from "@/types/settings-schema";
import { auth } from "@/auth";

export const settings = async (values: z.infer<typeof SettingsSchema>) => {
  const user = await auth();

  if (!user) {
    return { error: "User not found" };
  }
  const dbUser = await db.user.findFirst({
    where: {
      id: user.user.id,
    },
  });
  if (!dbUser) {
    return { error: "User not found" };
  }
  if (user.user.isOAuth) {
    values.email = undefined;
    values.password = undefined;
    values.newPassword = undefined;
    values.isTwoFactorEnabled = undefined;
  }
  const validatedFields = SettingsSchema.safeParse(values);

  if (values.password && values.newPassword && dbUser.password) {
    const passwordMatch = await bcrypt.compare(
      values.password,
      dbUser.password
    );
    if (!passwordMatch) {
      return { error: "Incorrect Password" };
    }
    const samePassword = await bcrypt.compare(
      values.newPassword,
      dbUser.password
    );
    if (samePassword) {
      return { error: "New password is same as old password" };
    }
    const hashedPassword = await bcrypt.hash(values.newPassword, 10);
    (values.password = hashedPassword), (values.newPassword = undefined);
  }

  await db.user.update({
    where: { id: dbUser.id },
    data: {
      ...values
    },
  });
  return { success: "user updated!" };
};
