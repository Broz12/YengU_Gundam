create table if not exists public.order_receipts (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null unique references public.orders (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  receipt_number text not null unique,
  recipient_email text not null,
  owner_email text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.notification_deliveries (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  receipt_id uuid references public.order_receipts (id) on delete set null,
  user_id uuid not null references auth.users (id) on delete cascade,
  channel text not null check (channel in ('owner_email', 'owner_whatsapp', 'customer_receipt_email')),
  recipient text not null,
  provider text,
  status text not null default 'pending' check (status in ('pending', 'sent', 'skipped', 'failed')),
  provider_message_id text,
  response_body jsonb,
  error_message text,
  sent_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists order_receipts_user_id_created_at_idx
  on public.order_receipts (user_id, created_at desc);

create index if not exists notification_deliveries_order_id_created_at_idx
  on public.notification_deliveries (order_id, created_at desc);

drop trigger if exists set_notification_deliveries_updated_at on public.notification_deliveries;
create trigger set_notification_deliveries_updated_at
before update on public.notification_deliveries
for each row execute function public.touch_updated_at();

alter table public.order_receipts enable row level security;
alter table public.notification_deliveries enable row level security;

drop policy if exists "order_receipts_select_own" on public.order_receipts;
create policy "order_receipts_select_own"
on public.order_receipts
for select
to authenticated
using (auth.uid() = user_id);
