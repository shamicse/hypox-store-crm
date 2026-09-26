"use client";
import { useEffect, useState } from "react";
import { Shell, api } from "./storefront";
import { Title, Choice } from "./commerce-pages";
import { toast } from "sonner";
export default function Login() {
  const [state, setState] = useState<any>(),
    [returnTo, setReturnTo] = useState("/account"),
    [error, setError] = useState(""),
    [role, setRole] = useState("admin");
  useEffect(() => {
    const p = new URLSearchParams(location.search);
    const r = p.get("returnTo");
    if (r?.startsWith("/") && !r.startsWith("//")) setReturnTo(r);
    const e = p.get("error");
    if (e)
      setError(
        e === "setup"
          ? "Google sign-in is not configured yet."
          : e === "expired"
            ? "Your sign-in expired. Please try again."
            : "Google sign-in could not be completed. Please try again.",
      );
    api("auth/status")
      .then(setState)
      .catch((e) => setError(e.message));
  }, []);
  return (
    <Shell>
      <Title
        title="Your HypoX. Your space."
        sub="Save your rotation, track orders, and make it yours."
      />
      <div className="panel stack" style={{ maxWidth: 500, margin: "0 auto" }}>
        <div className="brand" style={{ fontSize: 44 }}>
          Hypo<span>X</span>
        </div>
        <p>your vive. your x</p>
        {error && (
          <div className="notice error" role="alert">
            {error}
          </div>
        )}
        {state?.google ? (
          <a
            className="btn"
            href={"/api/auth/google?returnTo=" + encodeURIComponent(returnTo)}
            target="_top"
          >
            Continue with Google
          </a>
        ) : (
          <>
            <button className="btn" disabled>
              Continue with Google
            </button>
            <p className="small">
              Google login is coming soon. The store owner needs to connect the
              Google OAuth client. You can still explore the collection and
              build your bag.
            </p>
          </>
        )}
        <p className="small">
          We use your verified Google identity to create your HypoX account. We
          never ask for your Gmail password.
        </p>
        {state?.development && (
          <div className="stack notice">
            <strong>Local development only</strong>
            <Choice
              label="Test account role"
              value={role}
              onChange={setRole}
              options={[
                ["admin", "Administrator"],
                ["seller", "Seller"],
                ["customer", "Customer"],
              ]}
            />
            <button
              className="btn secondary"
              onClick={() =>
                api("auth/dev", { role })
                  .then(() => location.assign(returnTo))
                  .catch((e) => toast.error(e.message))
              }
            >
              Enter local test account
            </button>
          </div>
        )}
      </div>
    </Shell>
  );
}
