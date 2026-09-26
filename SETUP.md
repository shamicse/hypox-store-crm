# HypoX — your vive. your x

A clothing-only, mobile-first commerce starter with a working relational backend. The storefront starts in **demo payment mode**. No real payment is collected until a merchant configures and validates the payment adapters.

## Quick start

Requires Node.js 22.13+ (Node 24 recommended), npm, and Windows, macOS, or Linux.

```sh
npm ci
```

Copy `.env.example` to `.env`, then:

```sh
npm run build
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_shallow_jack_power.sql
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0001_bumpy_deadpool.sql
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0002_chubby_ultimates.sql
npm run dev
```

Open the Local URL printed by the server (normally `http://localhost:5173`). The database and uploaded images persist locally in `.wrangler/state`. Apply each migration once, in order; do not replay migrations against a database that already has them. This delivered checkout already has its local migrations applied.

The first catalog request seeds 12 HypoX clothing products and the `HYPOX10` coupon in demo mode. No sample catalog is seeded when `PAYMENT_MODE=live`. Older sample electronics listings, if present locally, are archived by the HypoX seed.

Visit `/login` and choose a local customer, seller, or administrator test account. This fallback requires BOTH `APP_ENV=development` and `DEV_AUTH=true`, and only works on loopback. It is disabled in the deployed store. There is no ChatGPT login in the app.

## Google / Gmail login

Google OAuth is implemented using server-side authorization-code exchange, PKCE, a one-time state value, verified Google userinfo, and opaque database-backed sessions. Google credentials have not been supplied, so production sign-in intentionally shows a setup state. Browsing and guest bags still work.

1. In [Google Cloud Console](https://console.cloud.google.com/auth/clients), create a project or select the brand's project.
2. Configure the Google Auth Platform consent screen: HypoX, your support email, authorized domain, and your deployed privacy/terms URLs. Request only `openid`, `email`, and `profile`.
3. Create an OAuth client of type **Web application**.
4. Add the exact authorized redirect URI: `<your deployed HTTPS origin>/api/auth/callback`. For local testing also add `http://localhost:5173/api/auth/callback`.
5. Store `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` as hosting environment secrets. Set `APP_URL` to the exact origin, with no path. Never commit the client secret or send it through chat.
6. In testing mode, add test-user Google accounts. Publish the Google consent configuration when ready for other customers; follow any domain verification requested by Google.
7. Redeploy the saved app version after changing hosting environment values, then complete a real sign-in test. `shamisa9234@gmail.com` is the configured deployed administrator; the verified Google email must match it.

Google login uses Google accounts, including Gmail and supported Workspace accounts. HypoX never sees or stores a Gmail password. Access tokens are used only for the server-side identity lookup and are not stored. Session cookies are HTTP-only, host-scoped, SameSite=Lax, and Secure in production. Sessions expire after 7 days and are revoked on logout.

Official references: [Google web-server OAuth](https://developers.google.com/identity/protocols/oauth2/web-server), [Google OpenID Connect](https://developers.google.com/identity/openid-connect/openid-connect).

## Included functionality

- Clothing catalog: tees, hoodies, sweatshirts, cargos, jackets; 12 sample products; local product photos.
- Responsive dark/light storefront, search, category/price/stock filters, sorting and pagination.
- Product pages rendered with product-specific titles/descriptions; size selection S–XXL; size guide.
- Database-backed guest and account carts; guest-cart merge; saved wishlist and addresses.
- Server-authoritative pricing, shipping and coupons; stock reservation in an atomic D1 batch; idempotent checkout.
- Demo payment completion, saved order history, fulfillment status/tracking reference, delivered-order reviews.
- Return requests within 7 days and admin workflow through review, receipt, and refund pending.
- Customer, seller and admin roles; ownership checks on every protected API; seller catalog editing, uploads and inventory.
- Admin seller approvals, promotions, fulfillment, returns, support inbox, durable email outbox and audit records.
- Paid-item sales summaries and per-product chart; excludes demo transactions.
- Home, About, Services, Shop/Menu, Categories, Deals, Contact, FAQ, Blog, Privacy, Terms, Returns, Shipping, Careers, Seller onboarding, Size guide, Login, Account, Orders and dashboards.
- Zod API validation, prepared SQL, origin checks, request-size limits, basic write rate limits, image signature validation, secure session cookies, CSP and security headers.
- WebMCP catalog search and add-to-bag actions where the browser supports them.

## Payment and email integration

`lib/payments.ts` contains Stripe Checkout and Razorpay Payment Link adapters. `app/api/webhooks/[provider]/route.ts` verifies raw-body HMAC signatures, Stripe timestamp tolerance, event idempotency, and amount/currency/order matching before marking a payment paid. A browser redirect alone never confirms payment.

- Stripe: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`. Subscribe to `checkout.session.completed` and `checkout.session.async_payment_succeeded` at `/api/webhooks/stripe`.
- Razorpay: `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`. Subscribe to `payment_link.paid` at `/api/webhooks/razorpay`.
- Set `APP_URL` to the trusted HTTPS origin. Test provider sandbox accounts and webhooks before enabling `PAYMENT_MODE=live`. Payment-method availability depends on the merchant's country and approved provider account.
- Prices and settlement requests currently use INR. International addresses and supported international cards are scaffolded; foreign-currency conversion is not implemented.
- Provider failures preserve unpaid orders for retry/reconciliation. Do not release inventory for a potentially paid order without checking the provider. Scheduled abandoned-payment reconciliation is not implemented.
- Email defaults to a durable `outbox` table. `lib/email.ts` supplies a Resend adapter for a future queue consumer. No external email is sent automatically. A production consumer must claim rows, retry with bounded backoff, and record delivery status.

## Structure and stack

```text
app/                  Next-style routes, metadata, API endpoints
components/           Storefront, commerce pages, login, dashboard, public pages
components/ui/        Accessible Radix/Shadcn primitives
lib/auth.ts           Google OAuth/session utilities
lib/server.ts         Database boundary, authorization, validation helpers
lib/catalog.ts        Catalog queries and idempotent demo seeding
lib/commerce.ts       Pricing, inventory, checkout and payment completion
lib/payments.ts       Stripe/Razorpay integration adapters
lib/email.ts          Email adapter interface
lib/seed.ts           Sample HypoX collection
lib/validation.ts     Request schemas
db/schema.ts          Drizzle relational schema (19 tables)
drizzle/              Versioned SQL migrations and immutable metadata
public/images/        Bundled sample photography
scripts/test-*.mjs     Local integration, authorization and authentication checks
.openai/hosting.json   Logical D1/R2 bindings and Site identity
```

TypeScript + React 19 + Next App Router conventions through **Vinext** on Cloudflare Workers; Tailwind 4 and Radix/Shadcn components; Drizzle migrations; D1 relational SQLite; R2 object storage. This is the working equivalent stack selected for the Sites runtime, not a PostgreSQL/Prisma project. Vinext is a beta dependency; validate upgrades in staging.

## Deployment

The project is configured for Sites hosting with logical `DB` (D1) and `BUCKET` (R2) bindings. Sites provisions the resources, applies the versioned migrations, and deploys the built Worker. Build output is `dist/server/index.js` and `dist/client`. Environment values belong in hosting settings, never in `.openai/hosting.json`.

Use `APP_ENV=production`, `DEV_AUTH=false`, your trusted `APP_URL`, and the intended `ADMIN_EMAILS`. Keep payment mode `demo` until payment, tax, shipping and catalog setup is complete. Public store access is configured separately from app account roles. Standalone hosting requires equivalent D1/R2 bindings, migration application, runtime secrets, and the same app origin; do not use the placeholder database ID from local build configuration as a production resource.

## Validation

With the local dev server running and the example demo configuration:

```sh
npx tsc --noEmit
node scripts/test-integration.mjs
node scripts/test-authorization.mjs
node scripts/test-auth.mjs
npm run build
```

Tests create clearly labeled demo products, addresses, orders and reviews. The authorization test temporarily changes and restores the local test user's role. Run only against the local database. Real Google sign-in and real payment-provider round trips require credentials and are not covered by these checks.

## Production boundaries

This is a functional starter, not an Amazon-scale production deployment certification.

- Inventory is currently pooled per garment across sizes. Size is saved on each cart and order line. Add per-size SKUs and reservations before managing actual size-specific stock.
- Tax/GST invoices, marketplace KYC, seller payouts, automated refunds, carrier APIs, fraud checks, and abandoned-payment reconciliation are not completed integrations.
- Returns do not automatically refund or restock. Partial-item returns are not yet supported.
- Customer history is limited to the latest 100 orders; dashboards to 200 products/items. Catalog pagination is implemented. Add cursor pagination to operational datasets as they grow.
- Catalog queries have indexes and bounded results. Responses are currently private/no-store for correctness. Introduce public catalog caching with invalidation on product/inventory changes; never cache personalized responses publicly.
- Move email, reconciliation and fulfillment events to queues. Load-test stock contention and D1 query patterns. A high-throughput multi-merchant expansion should evaluate database partitioning or an HTTP-accessible PostgreSQL service.
- Add backup/restore drills, monitoring, alerting, abuse controls, accessibility audits, credential rotation and retention/deletion workflows before live launch.
- All product specs, photography, prices, delivery times, policies and legal pages are sample content that the merchant must finalize before real sales.

## Image credits

Illustrative clothing photography from Unsplash (not actual HypoX manufactured inventory). See `IMAGE-CREDITS.md` for source links. Replace with owned product photography before launch.
