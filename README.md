# Hypox Store + CRM

Combined storefront (`/`) and protected CRM (`/admin`).

Hosted test: https://hypox-test.shamipos.chatgpt.site (sign-in required).

Runtime secrets and deployed database contents are not included. Use `.env.example` for configuration. See SETUP.md for development details.

# Hypox: one codebase, two experiences

This project combines the Hypox storefront and Hypox Control CRM into one application and one shared backend. The screens remain separate.

| Address | Experience | Access |
|---|---|---|
| `/` and `/shop` | Customer storefront | Public |
| `/account`, `/orders`, `/checkout` | Customer account and shopping | Existing store sign-in |
| `/seller` | Seller dashboard | Existing approved seller account |
| `/admin` | Modern CRM and store management | ChatGPT sign-in plus server-verified owner/team role |

## What is shared

One dependency installation, one build, one database, one image-storage bucket and one authoritative catalog. Product, seller, coupon, order and content changes made in the live CRM use the store's backend directly. Sample data remains separate from live records.

There is no second CRM deployment or bridge secret to maintain in this version. The former external bridge endpoints are removed. The admin API takes identity from authenticated server headers; clients cannot choose their own role or actor.

## What remains separate

Storefront and admin use separate root layouts and stylesheets. Customers see the shopping experience; staff see the management workspace. Navigation between the two roots performs a full-page transition. The admin is excluded from indexing, and its page and APIs require authorization.

This is one source project distributed in one ZIP file. It intentionally contains multiple organized source files, rather than squeezing a complete store, authentication system and CRM into one unmaintainable source file. This does not create a native Android or iOS app.

## Project layout

```text
app/
  (store)/                 Customer storefront layout and pages
  (control)/
    layout.tsx             Separate admin layout
    admin.css              Admin styling
    admin/page.tsx         Protected /admin entry
  api/admin/               Authenticated CRM operations
  api/admin/upload/        Authenticated admin image upload
  api/crm-content/         Published public content only
  api/...                  Existing store APIs
components/admin.tsx       Admin screens
lib/crm.ts                 Shared CRM validation, permissions and persistence
lib/crm-models.ts          Entity/form definitions and resource permissions
db/schema.ts               Shared data schema
drizzle/                   Additive database migrations
```

## Running and deploying

1. Install dependencies with `npm ci` using the included lockfile.
2. Copy `.env.example` to `.env` for development and set `CRM_OWNER_EMAIL` to the authorized owner's email. The bundled local ChatGPT sign-in uses `seedy@sites.test`; use that only in local development.
3. Keep existing storefront payment/Google identity settings. Set `DEV_AUTH=false` and `APP_ENV=production` for production.
4. Generate the deployment with `npm run build`. Apply local D1 migrations as described in SETUP.md; Sites applies production migrations during publishing.
5. Open `/admin`, sign in, and start with Sample workspace. The storefront and CRM now use the same D1/R2 bindings.
6. For deployment to the existing Hypox store, use the original store's own `.openai/hosting.json` identity; this repository's manifest identifies the separate test site. Do not deploy a public combined storefront with owner-only site access: protect `/admin` through its server authorization instead.

The existing storefront's public audience remains appropriate. The admin page and both admin endpoints verify identity and membership on every request. Only the configured owner can add or change team roles.

## Validation and delivery status

The combined project passed TypeScript validation and its production build. The test site is deployed at https://hypox-test.shamipos.chatgpt.site with a separate database. Full end-to-end browser validation remains outstanding.

## Current MVP limits

- Product stock is pooled across variants.
- Real refunds are issued through the payment provider; the CRM records their state and reference.
- Conversion requires session tracking and is shown as unavailable until connected.
- The page builder supports text sections, not arbitrary drag-and-drop layouts.
- Reports currently load up to 5,000 records per collection and 10,000 order lines; larger stores need server-paginated reporting.
- Coupon usage is reserved at order creation; abandoned/failed orders still consume that reservation.
- Store settings are saved records; connecting additional settings to checkout/shipping behavior requires explicit implementation.

No credentials, dependency folders or local customer/test databases are included in the downloadable source.

