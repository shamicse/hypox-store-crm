import { cookies } from "next/headers";
import {
  authDatabase,
  token,
  hash,
  safeReturn,
  cookieOptions,
  issueSession,
  googleReady,
  devAllowed,
} from "@/lib/auth";
import { config, boundary, json, HttpError, body } from "@/lib/server";
import { z } from "zod";
const redirect = (path: string) =>
  new Response(null, {
    status: 302,
    headers: { Location: path, "Cache-Control": "no-store" },
  });
export async function GET(
  req: Request,
  ctx: { params: Promise<{ action: string }> },
) {
  return boundary(async () => {
    const { action } = await ctx.params;
    const c = config(),
      url = new URL(req.url),
      jar = await cookies();
    if (action === "status")
      return json({ google: googleReady(), development: devAllowed(req) });
    if (action === "google") {
      if (!googleReady()) return redirect("/login?error=setup");
      const origin = new URL(c.APP_URL!).origin;
      if (origin !== url.origin)
        throw new HttpError(400, "Authentication origin mismatch.");
      const state = token(),
        verifier = token();
      const digest = new Uint8Array(
        await crypto.subtle.digest(
          "SHA-256",
          new TextEncoder().encode(verifier),
        ),
      );
      const challenge = btoa(String.fromCharCode(...digest))
        .replaceAll("+", "-")
        .replaceAll("/", "_")
        .replaceAll("=", "");
      await authDatabase()
        .prepare(
          "INSERT INTO oauth_states (stateHash,verifier,returnTo,expiresAt) VALUES (?,?,?,?)",
        )
        .bind(
          await hash(state),
          verifier,
          safeReturn(url.searchParams.get("returnTo")),
          Date.now() + 600000,
        )
        .run();
      await authDatabase()
        .prepare("DELETE FROM oauth_states WHERE expiresAt<?")
        .bind(Date.now())
        .run();
      jar.set("hypox_oauth", state, cookieOptions(600));
      const target = new URL("https://accounts.google.com/o/oauth2/v2/auth");
      target.search = new URLSearchParams({
        client_id: c.GOOGLE_CLIENT_ID!,
        redirect_uri: origin + "/api/auth/callback",
        response_type: "code",
        scope: "openid email profile",
        state,
        code_challenge: challenge,
        code_challenge_method: "S256",
        prompt: "select_account",
      }).toString();
      return redirect(target.href);
    }
    if (action === "callback") {
      if (!googleReady()) return redirect("/login?error=setup");
      const state = url.searchParams.get("state"),
        stored = jar.get("hypox_oauth")?.value;
      jar.set("hypox_oauth", "", cookieOptions(0));
      if (!state || state !== stored || !/^[a-f0-9]{64}$/.test(state))
        return redirect("/login?error=expired");
      const record = await authDatabase()
        .prepare(
          "DELETE FROM oauth_states WHERE stateHash=? AND expiresAt>? RETURNING *",
        )
        .bind(await hash(state), Date.now())
        .first<any>();
      const code = url.searchParams.get("code");
      if (!record || !code || url.searchParams.has("error"))
        return redirect("/login?error=cancelled");
      const origin = new URL(c.APP_URL!).origin;
      const exchange = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          code,
          client_id: c.GOOGLE_CLIENT_ID!,
          client_secret: c.GOOGLE_CLIENT_SECRET!,
          redirect_uri: origin + "/api/auth/callback",
          grant_type: "authorization_code",
          code_verifier: record.verifier,
        }),
        signal: AbortSignal.timeout(15000),
      });
      if (!exchange.ok) return redirect("/login?error=provider");
      const tokens: any = await exchange.json();
      if (typeof tokens.access_token !== "string")
        return redirect("/login?error=provider");
      const result = await fetch(
        "https://openidconnect.googleapis.com/v1/userinfo",
        {
          headers: { Authorization: "Bearer " + tokens.access_token },
          signal: AbortSignal.timeout(15000),
        },
      );
      if (!result.ok) return redirect("/login?error=provider");
      const profile: any = await result.json();
      if (
        !profile.sub ||
        typeof profile.sub !== "string" ||
        typeof profile.email !== "string" ||
        profile.email_verified !== true
      )
        return redirect("/login?error=verified");
      const userId = "google:" + profile.sub;
      const role = (c.ADMIN_EMAILS || "")
        .split(",")
        .map((s) => s.trim().toLowerCase())
        .includes(profile.email.toLowerCase())
        ? "admin"
        : "customer";
      await authDatabase()
        .prepare(
          "INSERT INTO users (id,email,name,role) VALUES (?,?,?,?) ON CONFLICT(id) DO UPDATE SET email=excluded.email,name=excluded.name",
        )
        .bind(
          userId,
          profile.email,
          String(profile.name || profile.email).slice(0, 100),
          role,
        )
        .run();
      await issueSession(userId);
      return redirect(safeReturn(record.returnTo));
    }
    throw new HttpError(404, "Authentication endpoint not found.");
  });
}
export async function POST(
  req: Request,
  ctx: { params: Promise<{ action: string }> },
) {
  return boundary(async () => {
    const { action } = await ctx.params;
    if (req.headers.get("origin") !== new URL(req.url).origin)
      throw new HttpError(403, "Cross-site authentication is not allowed.");
    const jar = await cookies();
    if (action === "logout") {
      const raw = jar.get("hypox_session")?.value;
      if (raw)
        await authDatabase()
          .prepare("DELETE FROM sessions WHERE tokenHash=?")
          .bind(await hash(raw))
          .run();
      jar.set("hypox_session", "", cookieOptions(0));
      return json({ ok: true });
    }
    if (action === "dev") {
      if (!devAllowed(req)) throw new HttpError(404, "Not found.");
      const input = await body(
        req,
        z.object({
          role: z.enum(["customer", "seller", "admin"]).default("admin"),
        }),
      );
      const userId =
        input.role === "admin" ? "local_seedy" : "local_" + input.role;
      await authDatabase()
        .prepare(
          "INSERT INTO users (id,email,name,role) VALUES (?,?,?,?) ON CONFLICT(id) DO UPDATE SET role=excluded.role",
        )
        .bind(
          userId,
          input.role === "admin"
            ? "seedy@sites.test"
            : input.role + "@hypox.test",
          "Local " + input.role,
          input.role,
        )
        .run();
      await issueSession(userId);
      return json({ ok: true });
    }
    throw new HttpError(404, "Not found.");
  });
}
