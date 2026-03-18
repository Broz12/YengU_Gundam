# Yengu Gundam Store

Yengu is now set up as a secure static storefront frontend with a Supabase-backed commerce architecture.

## What is included

- Responsive catalog with `Order now` flows
- Login and account profile capture before checkout
- Delivery date selection for each order
- Customization toggle with an extra `₹1,000`
- Sale pricing: `15%` off for `₹8,000` and above, `10%` off below `₹8,000`
- Order history section designed to read from Supabase
- Customer service / support request section
- Razorpay-ready checkout hooks for India-focused payments
- Supabase SQL schema and Edge Function scaffolding for secure order handling

## Repo structure

- `index.html`
- `styles.css`
- `app.js`
- `supabase-config.js`
- `supabase/config.toml`
- `supabase/.env.example`
- `supabase/seed.sql`
- `supabase/migrations/20260319000000_yengu_commerce.sql`
- `supabase/functions/create-razorpay-order/index.ts`
- `supabase/functions/verify-razorpay-payment/index.ts`

## Local preview

```bash
python3 -m http.server 4173
```

Then open `http://127.0.0.1:4173`.

## Local Supabase CLI

The repo now includes `supabase/config.toml` configured for this project ref and for the local
preview URL at `http://127.0.0.1:4173`.

For local CLI work, copy the template file and fill in your secrets:

```bash
cp supabase/.env.example supabase/.env.local
```

Keep `DATABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and `RAZORPAY_KEY_SECRET` only in trusted local
environment files or shell variables. Do not commit them.

## Secure setup

Public frontend config goes in `supabase-config.js`:

- `supabaseUrl`
- `supabasePublishableKey` or `supabaseAnonKey`
- `razorpayKeyId`
- `supportEmail`
- `supportWhatsapp`

Do not put secrets in the repo.

Keep these only in Supabase Edge Function environment variables:

- `SUPABASE_SERVICE_ROLE_KEY`
- `RAZORPAY_KEY_SECRET`
- `SUPABASE_PUBLISHABLE_KEY` or `SUPABASE_ANON_KEY`

Do not place the Postgres connection string in the frontend config.
That connection string is only for trusted admin/server tooling and should never ship to GitHub Pages.
Use `supabase/.env.local` or trusted shell environment variables for local database or function work.

## Supabase steps

1. Create a Supabase project.
2. Run the SQL in `supabase/migrations/20260319000000_yengu_commerce.sql`.
3. Deploy the Edge Functions from `supabase/functions/`.
4. Set the Edge Function environment variables for Supabase service role and Razorpay secret.
5. Fill `supabase-config.js` with your public project values.

## Notes

- Order data is designed to stay in Supabase, not in the repo.
- Checkout requires login before ordering.
- Payment verification is intended to happen server-side through the Edge Functions.
