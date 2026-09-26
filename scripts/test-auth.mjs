import assert from "node:assert/strict";
const origin = "http://localhost:5173";
const ready = await fetch(origin + "/api/auth/status").then((r) => r.json());
assert.equal(ready.google, false);
assert.equal(ready.development, true);
const start = await fetch(origin + "/api/auth/google", { redirect: "manual" });
assert.equal(start.status, 302);
assert.equal(start.headers.get("location"), "/login?error=setup");
const forged = await fetch(origin + "/api/me", {
  headers: {
    "oai-authenticated-user-id": "attacker",
    "oai-authenticated-user-email": "shamisa9234@gmail.com",
  },
}).then((r) => r.json());
assert.equal(forged.user, null);
const wrong = await fetch(origin + "/api/auth/dev", {
  method: "POST",
  headers: {
    Origin: "https://evil.invalid",
    "Content-Type": "application/json",
  },
  body: "{}",
});
assert.equal(wrong.status, 403);
const login = await fetch(origin + "/api/auth/dev", {
  method: "POST",
  headers: { Origin: origin, "Content-Type": "application/json" },
  body: JSON.stringify({ role: "customer" }),
});
assert.equal(login.status, 200);
const cookie = login.headers
  .getSetCookie()
  .map((s) => s.split(";")[0])
  .join("; ");
assert.ok(cookie.startsWith("hypox_session="));
const headers = {
  Cookie: cookie,
  Origin: origin,
  "Content-Type": "application/json",
};
const me = await fetch(origin + "/api/me", { headers }).then((r) => r.json());
assert.equal(me.user.role, "customer");
for (const size of ["M", "XL"]) {
  const r = await fetch(origin + "/api/cart", {
    method: "POST",
    headers,
    body: JSON.stringify({
      productId: "midnight-tee",
      quantity: 1,
      replace: true,
      size,
    }),
  });
  assert.equal(r.status, 200);
}
const bag = await fetch(origin + "/api/cart", { headers }).then((r) =>
  r.json(),
);
assert.ok(bag.items.some((p) => p.size === "M"));
assert.ok(bag.items.some((p) => p.size === "XL"));
const logout = await fetch(origin + "/api/auth/logout", {
  method: "POST",
  headers,
  body: "{}",
});
assert.equal(logout.status, 200);
const after = await fetch(origin + "/api/me", { headers }).then((r) =>
  r.json(),
);
assert.equal(after.user, null);
console.log(
  "PASS Google setup fallback, ignored spoofed identity headers, CSRF, opaque sessions, customer login, separate size lines and session revocation",
);
