#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PROJECT_REF="${PROJECT_REF:-nqnesnbqifhtegxcqpew}"
SECRETS_FILE="${SECRETS_FILE:-$ROOT_DIR/supabase/.env.functions}"

if [[ -z "${SUPABASE_ACCESS_TOKEN:-}" ]]; then
  echo "Missing SUPABASE_ACCESS_TOKEN"
  echo "Create a personal access token in Supabase and export it before running this script."
  exit 1
fi

if [[ -z "${SUPABASE_DB_PASSWORD:-}" ]]; then
  echo "Missing SUPABASE_DB_PASSWORD"
  echo "Add your database password from the Supabase project settings before running this script."
  exit 1
fi

cd "$ROOT_DIR"

echo "Linking local repo to project $PROJECT_REF..."
npx --yes supabase@latest link --project-ref "$PROJECT_REF" --password "$SUPABASE_DB_PASSWORD"

if [[ -f "$SECRETS_FILE" ]]; then
  echo "Syncing Edge Function secrets..."
  bash "$ROOT_DIR/scripts/set-supabase-secrets.sh" "$SECRETS_FILE"
else
  echo "Skipping secrets sync because $SECRETS_FILE does not exist."
fi

echo "Pushing database migrations..."
npx --yes supabase@latest db push

echo "Deploying create-razorpay-order..."
npx --yes supabase@latest functions deploy create-razorpay-order --use-api

echo "Deploying verify-razorpay-payment..."
npx --yes supabase@latest functions deploy verify-razorpay-payment --use-api

echo "Supabase deploy flow finished for $PROJECT_REF"
