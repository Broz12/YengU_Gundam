alter table public.orders
  add column if not exists discount_rate numeric(5, 2) not null default 0,
  add column if not exists discount_amount_inr integer not null default 0,
  add column if not exists discounted_base_price_inr integer not null default 0;

update public.orders
set
  discount_rate = case
    when base_price_inr >= 8000 then 0.15
    else 0.10
  end,
  discount_amount_inr = round(
    base_price_inr *
    case
      when base_price_inr >= 8000 then 0.15
      else 0.10
    end
  ),
  discounted_base_price_inr = base_price_inr - round(
    base_price_inr *
    case
      when base_price_inr >= 8000 then 0.15
      else 0.10
    end
  )
where discounted_base_price_inr = 0;
