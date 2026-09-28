import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";

export const COOKIE = "gma_session";
export type Session = { uid: string; name: string; role: "ADMIN" | "STORE"; storeId: string | null };

const key = () => {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 16) throw new Error("AUTH_SECRET is missing or too short");
  return new TextEncoder().encode(s);
};

export async function createSession(s: Session) {
  const token = await new SignJWT({ ...s })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("12h")
    .sign(key());
  (await cookies()).set(COOKIE, token, {
    httpOnly: true, secure: process.env.NODE_ENV === "production",
    sameSite: "lax", path: "/", maxAge: 60 * 60 * 12,
  });
}

export async function getSession(): Promise<Session | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, key());
    return payload as unknown as Session;
  } catch {
    return null;
  }
}

export async function destroySession() {
  (await cookies()).delete(COOKIE);
}

/** Use at the top of every admin page/action. */
export async function requireAdmin() {
  const s = await getSession();
  if (!s) redirect("/login");
  if (s.role !== "ADMIN") redirect("/store");
  return s;
}

/** Use at the top of every store page/action. storeId comes from the session, never from the URL. */
export async function requireStore() {
  const s = await getSession();
  if (!s) redirect("/login");
  if (s.role !== "STORE" || !s.storeId) redirect("/admin");
  return { ...s, storeId: s.storeId };
}
