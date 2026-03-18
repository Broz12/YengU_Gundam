create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  phone text,
  line1 text,
  line2 text,
  city text,
  state text,
  pincode text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  product_code text not null,
  product_title text not null,
  base_price_inr integer not null check (base_price_inr > 0),
  customization_requested boolean not null default false,
  customization_fee_inr integer not null default 0 check (customization_fee_inr >= 0),
  customization_notes text,
  total_price_inr integer not null check (total_price_inr > 0),
  delivery_date date not null,
  shipping_name text not null,
  shipping_email text not null,
  shipping_phone text not null,
  shipping_line1 text not null,
  shipping_line2 text,
  shipping_city text not null,
  shipping_state text not null,
  shipping_pincode text not null,
  order_notes text,
  payment_provider text not null default 'razorpay',
  payment_order_id text,
  payment_id text,
  payment_signature text,
  payment_method text,
  payment_status text not null default 'created',
  order_status text not null default 'payment_created',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.support_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  email text not null,
  subject text not null,
  order_reference text,
  message text not null,
  status text not null default 'open',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists orders_user_id_created_at_idx
  on public.orders (user_id, created_at desc);

create index if not exists support_requests_user_id_created_at_idx
  on public.support_requests (user_id, created_at desc);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.touch_updated_at();

drop trigger if exists set_orders_updated_at on public.orders;
create trigger set_orders_updated_at
before update on public.orders
for each row execute function public.touch_updated_at();

drop trigger if exists set_support_requests_updated_at on public.support_requests;
create trigger set_support_requests_updated_at
before update on public.support_requests
for each row execute function public.touch_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    email,
    full_name,
    phone,
    line1,
    line2,
    city,
    state,
    pincode
  )
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'phone',
    new.raw_user_meta_data ->> 'line1',
    new.raw_user_meta_data ->> 'line2',
    new.raw_user_meta_data ->> 'city',
    new.raw_user_meta_data ->> 'state',
    new.raw_user_meta_data ->> 'pincode'
  )
  on conflict (id) do update
    set email = excluded.email;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.orders enable row level security;
alter table public.support_requests enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles
for insert
to authenticated
with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "orders_select_own" on public.orders;
create policy "orders_select_own"
on public.orders
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "support_requests_select_own" on public.support_requests;
create policy "support_requests_select_own"
on public.support_requests
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "support_requests_insert_own" on public.support_requests;
create policy "support_requests_insert_own"
on public.support_requests
for insert
to authenticated
with check (auth.uid() = user_id);
