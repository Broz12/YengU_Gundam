#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="${1:-$ROOT_DIR/supabase/.env.functions}"

if [[ -z "${SUPABASE_ACCESS_TOKEN:-}" ]]; then
  echo "Missing SUPABASE_ACCESS_TOKEN"
  echo "Export your Supabase personal access token before syncing secrets."
  exit 1
fi

if [[ ! -f "$ENV_FILE" ]]; then
  echo "No secrets file found at $ENV_FILE"
  echo "Create it from supabase/.env.functions.example when you are ready."
  exit 0
fi

set -a
source "$ENV_FILE"
set +a

tmp_file="$(mktemp)"
cleanup() {
  rm -f "$tmp_file"
}
trap cleanup EXIT

append_secret() {
  local name="$1"
  local value="${!name:-}"

  if [[ -n "$value" ]]; then
    printf '%s=%s\n' "$name" "$value" >>"$tmp_file"
  fi
}

append_secret "RAZORPAY_KEY_ID"
append_secret "RAZORPAY_KEY_SECRET"
append_secret "OWNER_NOTIFICATION_EMAIL"
append_secret "OWNER_NOTIFICATION_WHATSAPP"
append_secret "EMAIL_FROM"
append_secret "RESEND_API_KEY"
append_secret "WHATSAPP_ACCESS_TOKEN"
append_secret "WHATSAPP_PHONE_NUMBER_ID"

if [[ ! -s "$tmp_file" ]]; then
  echo "No non-empty secrets found in $ENV_FILE"
  exit 0
fi

npx --yes supabase@latest secrets set --env-file "$tmp_file"
echo "Supabase Edge Function secrets synced from $ENV_FILE"
