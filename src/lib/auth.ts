import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const COOKIE = "admin_session";
const password = () => process.env.ADMIN_PASSWORD || "";
export const adminEnabled = () => password().length >= 8;
const token = () => createHmac("sha256", password()).update("halden-admin-v1").digest("hex");

export function checkPassword(input: string) {
  if (!adminEnabled()) return false;
  const a = Buffer.from(createHmac("sha256", "x").update(input).digest()), b = Buffer.from(createHmac("sha256", "x").update(password()).digest());
  return timingSafeEqual(a, b);
}
export const sessionValue = token;

export async function isAdmin() {
  if (!adminEnabled()) return false;
  const v = (await cookies()).get(COOKIE)?.value;
  if (!v) return false;
  const a = Buffer.from(v), b = Buffer.from(token());
  return a.length === b.length && timingSafeEqual(a, b);
}
