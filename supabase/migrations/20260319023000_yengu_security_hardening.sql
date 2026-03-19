create index if not exists notification_deliveries_receipt_id_idx
  on public.notification_deliveries (receipt_id);

create index if not exists notification_deliveries_user_id_idx
  on public.notification_deliveries (user_id, created_at desc);

alter table public.profiles force row level security;
alter table public.orders force row level security;
alter table public.support_requests force row level security;
alter table public.order_receipts force row level security;
alter table public.notification_deliveries force row level security;
