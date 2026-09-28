"use server";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createSession, destroySession } from "@/lib/session";

export async function login(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const user = await prisma.user.findUnique({ where: { email } });

  // Always run a hash compare so response time doesn't reveal whether the email exists.
  const hash = user?.passwordHash ?? "$2a$10$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvalidin";
  const ok = await bcrypt.compare(password, hash);
  if (!user || !user.active || !ok) redirect("/login?error=1");

  await createSession({ uid: user.id, name: user.name, role: user.role, storeId: user.storeId });
  await prisma.activityLog.create({ data: { userId: user.id, action: "LOGIN", entity: "User", entityId: user.id } });
  redirect(user.role === "ADMIN" ? "/admin" : "/store");
}

export async function logout() {
  await destroySession();
  redirect("/login");
}
