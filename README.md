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
- `auth.html`
- `styles.css`
- `app.js`
- `supabase-config.js`
- `favicon.svg`
- `site.webmanifest`
- `robots.txt`
- `supabase/config.toml`
- `supabase/.env.example`
- `supabase/.env.functions.example`
- `supabase/seed.sql`
- `supabase/migrations/20260319000000_yengu_commerce.sql`
- `supabase/functions/create-razorpay-order/index.ts`
- `supabase/functions/verify-razorpay-payment/index.ts`
- `supabase/migrations/20260319020000_yengu_order_notifications.sql`
- `supabase/migrations/20260319023000_yengu_security_hardening.sql`
- `scripts/deploy-supabase.sh`
- `scripts/set-supabase-secrets.sh`

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

The official Supabase CLI also works directly through `npx`, so you do not need a global install:

```bash
npx supabase --help
```

## Secure setup

Public frontend config goes in `supabase-config.js`:

- `supabaseUrl`
- `supabasePublishableKey` or `supabaseAnonKey`
- `razorpayKeyId`
- `supportEmail`
- `supportWhatsapp`

Do not put secrets in the repo.

Keep these only in Supabase Edge Function environment variables:

- `RAZORPAY_KEY_SECRET`
- `OWNER_NOTIFICATION_EMAIL`
- `OWNER_NOTIFICATION_WHATSAPP`
- `EMAIL_FROM`
- `RESEND_API_KEY`
- `WHATSAPP_ACCESS_TOKEN`
- `WHATSAPP_PHONE_NUMBER_ID`

Do not place the Postgres connection string in the frontend config.
That connection string is only for trusted admin/server tooling and should never ship to GitHub Pages.
Use `supabase/.env.local` or trusted shell environment variables for local database or function work.

For hosted Edge Functions, Supabase already provides `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and
`SUPABASE_SERVICE_ROLE_KEY` by default. The repo's `supabase/.env.functions.example` is only for
your additional custom secrets such as Razorpay and notification providers.

## Supabase steps

1. Create a Supabase project.
2. Run the SQL in `supabase/migrations/20260319000000_yengu_commerce.sql`.
3. Deploy the Edge Functions from `supabase/functions/`.
4. Set the custom Edge Function environment variables for Razorpay, owner notification targets, and your email / WhatsApp delivery provider keys.
5. Fill `supabase-config.js` with your public project values.

## One-command deploy flow

1. Create a personal access token in Supabase and export it:

```bash
export SUPABASE_ACCESS_TOKEN="your-personal-access-token"
```

2. Copy the secrets template and fill the values you actually have:

```bash
cp supabase/.env.functions.example supabase/.env.functions
```

3. Export your database password:

```bash
export SUPABASE_DB_PASSWORD="your-db-password"
```

4. Run the deploy helper:

```bash
bash scripts/deploy-supabase.sh
```

This helper uses the official CLI flow:
- `npx supabase link --project-ref nqnesnbqifhtegxcqpew`
- `npx supabase secrets set --env-file ...`
- `npx supabase db push`
- `npx supabase functions deploy create-razorpay-order --use-api`
- `npx supabase functions deploy verify-razorpay-payment --use-api`

## Go live checklist

1. Put the real live values into `supabase-config.js`:
   - `supabaseUrl`
   - `supabasePublishableKey`
   - `razorpayKeyId`
2. Set the Edge Function secrets in Supabase:
   - `RAZORPAY_KEY_ID`
   - `RAZORPAY_KEY_SECRET`
   - `OWNER_NOTIFICATION_EMAIL`
   - `OWNER_NOTIFICATION_WHATSAPP`
   - `EMAIL_FROM`
   - `RESEND_API_KEY`
   - `WHATSAPP_ACCESS_TOKEN`
   - `WHATSAPP_PHONE_NUMBER_ID`
3. In Supabase Auth settings, set your real site URL and redirect URLs for the deployed domain, not only the local `127.0.0.1:4173` preview URL.
4. Deploy the static files to your live host such as GitHub Pages, Netlify, or Vercel.
5. Test one real order end-to-end and confirm:
   - the order row is created
   - the payment verifies
   - `order_receipts` gets a receipt record
   - `notification_deliveries` logs owner email, owner WhatsApp, and customer receipt status

## Notes

- Order data is designed to stay in Supabase, not in the repo.
- Checkout requires login before ordering.
- Payment verification is intended to happen server-side through the Edge Functions.
- Home and account flows are split between `index.html` and `auth.html` to keep browsing cleaner.
- Owner alerts are designed to go to `brojendroningthoujam804@gmail.com` and `+919863355934` once the delivery provider keys are configured.
- Customer receipts and delivery-attempt logs are recorded in Supabase through `order_receipts` and `notification_deliveries`.
