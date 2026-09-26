import { env } from "cloudflare:workers";
import { cookies } from "next/headers";
import type { User } from "./types";
const settings = () => env as unknown as Record<string, string | undefined>;
export function authDatabase() {
  if (!env.DB) throw new Error("Authentication database unavailable");
  return env.DB;
}
export const token = () =>
  Array.from(crypto.getRandomValues(new Uint8Array(32)), (n) =>
    n.toString(16).padStart(2, "0"),
  ).join("");
export async function hash(value: string) {
  return Array.from(
    new Uint8Array(
      await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)),
    ),
    (n) => n.toString(16).padStart(2, "0"),
  ).join("");
}
export function safeReturn(value: string | null) {
  if (
    !value ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.includes("\\")
  )
    return "/account";
  const u = new URL(value, "https://local.invalid");
  return u.origin === "https://local.invalid"
    ? u.pathname + u.search
    : "/account";
}
export function cookieOptions(maxAge = 604800) {
  return {
    httpOnly: true,
    secure: settings().APP_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}
export async function getSessionUser(): Promise<User | null> {
  const raw = (await cookies()).get("hypox_session")?.value;
  if (!raw || !/^[a-f0-9]{64}$/.test(raw)) return null;
  return authDatabase()
    .prepare(
      "SELECT u.* FROM sessions s JOIN users u ON u.id=s.userId WHERE s.tokenHash=? AND s.expiresAt>?",
    )
    .bind(await hash(raw), Date.now())
    .first<User>();
}
export async function issueSession(userId: string) {
  const blocked = await authDatabase().prepare("SELECT key FROM crm_records WHERE key=? AND json_extract(data,'$.status')='blocked'").bind('live:customers:'+userId).first();
  if(blocked) throw new Error('This customer account is blocked. Contact support.');
  const value = token();
  await authDatabase()
    .prepare("INSERT INTO sessions (tokenHash,userId,expiresAt) VALUES (?,?,?)")
    .bind(await hash(value), userId, Date.now() + 604800000)
    .run();
  (await cookies()).set("hypox_session", value, cookieOptions());
  await authDatabase()
    .prepare("DELETE FROM sessions WHERE expiresAt<?")
    .bind(Date.now())
    .run();
}
export function googleReady() {
  return !!(
    settings().GOOGLE_CLIENT_ID &&
    settings().GOOGLE_CLIENT_SECRET &&
    settings().APP_URL
  );
}
export function devAllowed(req: Request) {
  return (
    settings().DEV_AUTH === "true" &&
    settings().APP_ENV === "development" &&
    ["localhost", "127.0.0.1"].includes(new URL(req.url).hostname)
  );
}
