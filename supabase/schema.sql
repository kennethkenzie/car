create extension if not exists pgcrypto;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type public.user_role as enum ('customer', 'staff', 'admin');
  end if;

  if not exists (select 1 from pg_type where typname = 'nav_link_kind') then
    create type public.nav_link_kind as enum ('top', 'quick');
  end if;

  if not exists (select 1 from pg_type where typname = 'product_media_kind') then
    create type public.product_media_kind as enum ('image', 'video');
  end if;

  if not exists (select 1 from pg_type where typname = 'product_relation_kind') then
    create type public.product_relation_kind as enum ('related', 'upsell', 'cross_sell');
  end if;
end
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.stores (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  support_email text,
  support_phone text,
  logo_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  store_id uuid references public.stores (id) on delete set null,
  email text unique,
  full_name text,
  phone text,
  role public.user_role not null default 'customer',
  avatar_url text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  description text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.navigation_links (
  id uuid primary key default gen_random_uuid(),
  kind public.nav_link_kind not null,
  label text not null,
  href text not null,
  icon text,
  badge_text text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.hero_slides (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  cta_label text not null,
  cta_href text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.hero_side_cards (
  id uuid primary key default gen_random_uuid(),
  eyebrow text,
  title text not null,
  image_url text not null,
  href text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.trust_features (
  id uuid primary key default gen_random_uuid(),
  icon text not null check (icon in ('wallet', 'package', 'truck')),
  title text not null,
  subtitle text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references public.categories (id) on delete set null,
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  is_active boolean not null default true,
  featured_on_home boolean not null default false,
  featured_sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.home_category_groups (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  cta_label text not null,
  cta_href text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.home_category_group_items (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.home_category_groups (id) on delete cascade,
  category_id uuid references public.categories (id) on delete set null,
  label text not null,
  image_url text not null,
  href text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores (id) on delete restrict,
  category_id uuid references public.categories (id) on delete set null,
  slug text not null unique,
  name text not null,
  short_description text,
  description text,
  brand text,
  currency_code text not null default 'UGX',
  list_price numeric(12,2),
  sale_price numeric(12,2),
  average_rating numeric(3,2) not null default 0,
  rating_count integer not null default 0,
  bestseller_label text,
  bestseller_category text,
  bought_past_month_label text,
  shipping_label text,
  in_stock_label text default 'In Stock',
  delivery_label text,
  returns_label text,
  payment_label text default 'Secure transaction',
  is_published boolean not null default false,
  is_featured_home boolean not null default false,
  home_sort_order integer not null default 0,
  published_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint product_price_check check (
    sale_price is null or list_price is null or sale_price <= list_price
  )
);

create table if not exists public.product_media (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  kind public.product_media_kind not null default 'image',
  url text not null,
  alt_text text,
  is_primary boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  sku text unique,
  option_name text not null default 'Size',
  option_value text not null,
  price numeric(12,2) not null,
  compare_at_price numeric(12,2),
  stock_qty integer not null default 0,
  is_default boolean not null default false,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint variant_price_check check (
    compare_at_price is null or price <= compare_at_price
  )
);

create table if not exists public.product_specs (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  spec_name text not null,
  spec_value text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.product_bullets (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  bullet_text text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.product_relations (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  related_product_id uuid not null references public.products (id) on delete cascade,
  relation_kind public.product_relation_kind not null default 'related',
  badge_text text,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint product_relations_unique unique (product_id, related_product_id, relation_kind),
  constraint product_relations_not_self check (product_id <> related_product_id)
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  title text,
  body text,
  is_approved boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint review_one_per_user unique (product_id, user_id)
);

create table if not exists public.wishlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  name text not null default 'Default',
  is_default boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.wishlist_items (
  id uuid primary key default gen_random_uuid(),
  wishlist_id uuid not null references public.wishlists (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  constraint wishlist_item_unique unique (wishlist_id, product_id)
);

create index if not exists idx_navigation_links_kind_sort
  on public.navigation_links (kind, sort_order)
  where is_active = true;

create index if not exists idx_hero_slides_sort
  on public.hero_slides (sort_order)
  where is_active = true;

create index if not exists idx_hero_side_cards_sort
  on public.hero_side_cards (sort_order)
  where is_active = true;

create index if not exists idx_trust_features_sort
  on public.trust_features (sort_order)
  where is_active = true;

create index if not exists idx_categories_parent_sort
  on public.categories (parent_id, featured_sort_order)
  where is_active = true;

create index if not exists idx_home_category_group_items_group_sort
  on public.home_category_group_items (group_id, sort_order)
  where is_active = true;

create index if not exists idx_products_published_home
  on public.products (is_published, is_featured_home, home_sort_order, published_at desc);

create index if not exists idx_products_category
  on public.products (category_id, published_at desc);

create index if not exists idx_product_media_product_sort
  on public.product_media (product_id, sort_order);

create index if not exists idx_product_variants_product_sort
  on public.product_variants (product_id, sort_order)
  where is_active = true;

create index if not exists idx_product_specs_product_sort
  on public.product_specs (product_id, sort_order);

create index if not exists idx_product_bullets_product_sort
  on public.product_bullets (product_id, sort_order);

create index if not exists idx_product_relations_product_sort
  on public.product_relations (product_id, relation_kind, sort_order);

create index if not exists idx_reviews_product_approved
  on public.reviews (product_id, is_approved, created_at desc);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name')
  )
  on conflict (id) do update
    set email = excluded.email;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create or replace function public.refresh_product_rating(product_row_id uuid)
returns void
language plpgsql
as $$
begin
  update public.products p
  set
    average_rating = coalesce((
      select round(avg(r.rating)::numeric, 2)
      from public.reviews r
      where r.product_id = product_row_id
        and r.is_approved = true
    ), 0),
    rating_count = coalesce((
      select count(*)
      from public.reviews r
      where r.product_id = product_row_id
        and r.is_approved = true
    ), 0),
    updated_at = timezone('utc', now())
  where p.id = product_row_id;
end;
$$;

create or replace function public.handle_review_change()
returns trigger
language plpgsql
as $$
begin
  perform public.refresh_product_rating(coalesce(new.product_id, old.product_id));
  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

drop trigger if exists refresh_product_rating_on_review_change on public.reviews;
create trigger refresh_product_rating_on_review_change
  after insert or update or delete on public.reviews
  for each row execute procedure public.handle_review_change();

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role in ('staff', 'admin')
  );
$$;

drop trigger if exists set_updated_at_stores on public.stores;
create trigger set_updated_at_stores
  before update on public.stores
  for each row execute procedure public.set_updated_at();

drop trigger if exists set_updated_at_profiles on public.profiles;
create trigger set_updated_at_profiles
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

drop trigger if exists set_updated_at_site_settings on public.site_settings;
create trigger set_updated_at_site_settings
  before update on public.site_settings
  for each row execute procedure public.set_updated_at();

drop trigger if exists set_updated_at_navigation_links on public.navigation_links;
create trigger set_updated_at_navigation_links
  before update on public.navigation_links
  for each row execute procedure public.set_updated_at();

drop trigger if exists set_updated_at_hero_slides on public.hero_slides;
create trigger set_updated_at_hero_slides
  before update on public.hero_slides
  for each row execute procedure public.set_updated_at();

drop trigger if exists set_updated_at_hero_side_cards on public.hero_side_cards;
create trigger set_updated_at_hero_side_cards
  before update on public.hero_side_cards
  for each row execute procedure public.set_updated_at();

drop trigger if exists set_updated_at_trust_features on public.trust_features;
create trigger set_updated_at_trust_features
  before update on public.trust_features
  for each row execute procedure public.set_updated_at();

drop trigger if exists set_updated_at_categories on public.categories;
create trigger set_updated_at_categories
  before update on public.categories
  for each row execute procedure public.set_updated_at();

drop trigger if exists set_updated_at_home_category_groups on public.home_category_groups;
create trigger set_updated_at_home_category_groups
  before update on public.home_category_groups
  for each row execute procedure public.set_updated_at();

drop trigger if exists set_updated_at_home_category_group_items on public.home_category_group_items;
create trigger set_updated_at_home_category_group_items
  before update on public.home_category_group_items
  for each row execute procedure public.set_updated_at();

drop trigger if exists set_updated_at_products on public.products;
create trigger set_updated_at_products
  before update on public.products
  for each row execute procedure public.set_updated_at();

drop trigger if exists set_updated_at_product_media on public.product_media;
create trigger set_updated_at_product_media
  before update on public.product_media
  for each row execute procedure public.set_updated_at();

drop trigger if exists set_updated_at_product_variants on public.product_variants;
create trigger set_updated_at_product_variants
  before update on public.product_variants
  for each row execute procedure public.set_updated_at();

drop trigger if exists set_updated_at_product_specs on public.product_specs;
create trigger set_updated_at_product_specs
  before update on public.product_specs
  for each row execute procedure public.set_updated_at();

drop trigger if exists set_updated_at_product_bullets on public.product_bullets;
create trigger set_updated_at_product_bullets
  before update on public.product_bullets
  for each row execute procedure public.set_updated_at();

drop trigger if exists set_updated_at_product_relations on public.product_relations;
create trigger set_updated_at_product_relations
  before update on public.product_relations
  for each row execute procedure public.set_updated_at();

drop trigger if exists set_updated_at_reviews on public.reviews;
create trigger set_updated_at_reviews
  before update on public.reviews
  for each row execute procedure public.set_updated_at();

drop trigger if exists set_updated_at_wishlists on public.wishlists;
create trigger set_updated_at_wishlists
  before update on public.wishlists
  for each row execute procedure public.set_updated_at();

alter table public.stores enable row level security;
alter table public.profiles enable row level security;
alter table public.site_settings enable row level security;
alter table public.navigation_links enable row level security;
alter table public.hero_slides enable row level security;
alter table public.hero_side_cards enable row level security;
alter table public.trust_features enable row level security;
alter table public.categories enable row level security;
alter table public.home_category_groups enable row level security;
alter table public.home_category_group_items enable row level security;
alter table public.products enable row level security;
alter table public.product_media enable row level security;
alter table public.product_variants enable row level security;
alter table public.product_specs enable row level security;
alter table public.product_bullets enable row level security;
alter table public.product_relations enable row level security;
alter table public.reviews enable row level security;
alter table public.wishlists enable row level security;
alter table public.wishlist_items enable row level security;

drop policy if exists "public read active stores" on public.stores;
create policy "public read active stores"
  on public.stores for select
  using (is_active = true);

drop policy if exists "staff manage stores" on public.stores;
create policy "staff manage stores"
  on public.stores for all
  using (public.is_staff())
  with check (public.is_staff());

drop policy if exists "users read own profile" on public.profiles;
create policy "users read own profile"
  on public.profiles for select
  using (auth.uid() = id or public.is_staff());

drop policy if exists "users update own profile" on public.profiles;
create policy "users update own profile"
  on public.profiles for update
  using (auth.uid() = id or public.is_staff())
  with check (auth.uid() = id or public.is_staff());

drop policy if exists "staff insert profiles" on public.profiles;
create policy "staff insert profiles"
  on public.profiles for insert
  with check (public.is_staff());

drop policy if exists "public read site settings" on public.site_settings;
create policy "public read site settings"
  on public.site_settings for select
  using (true);

drop policy if exists "staff manage site settings" on public.site_settings;
create policy "staff manage site settings"
  on public.site_settings for all
  using (public.is_staff())
  with check (public.is_staff());

drop policy if exists "public read navigation links" on public.navigation_links;
create policy "public read navigation links"
  on public.navigation_links for select
  using (is_active = true);

drop policy if exists "staff manage navigation links" on public.navigation_links;
create policy "staff manage navigation links"
  on public.navigation_links for all
  using (public.is_staff())
  with check (public.is_staff());

drop policy if exists "public read hero slides" on public.hero_slides;
create policy "public read hero slides"
  on public.hero_slides for select
  using (is_active = true);

drop policy if exists "staff manage hero slides" on public.hero_slides;
create policy "staff manage hero slides"
  on public.hero_slides for all
  using (public.is_staff())
  with check (public.is_staff());

drop policy if exists "public read hero side cards" on public.hero_side_cards;
create policy "public read hero side cards"
  on public.hero_side_cards for select
  using (is_active = true);

drop policy if exists "staff manage hero side cards" on public.hero_side_cards;
create policy "staff manage hero side cards"
  on public.hero_side_cards for all
  using (public.is_staff())
  with check (public.is_staff());

drop policy if exists "public read trust features" on public.trust_features;
create policy "public read trust features"
  on public.trust_features for select
  using (is_active = true);

drop policy if exists "staff manage trust features" on public.trust_features;
create policy "staff manage trust features"
  on public.trust_features for all
  using (public.is_staff())
  with check (public.is_staff());

drop policy if exists "public read categories" on public.categories;
create policy "public read categories"
  on public.categories for select
  using (is_active = true);

drop policy if exists "staff manage categories" on public.categories;
create policy "staff manage categories"
  on public.categories for all
  using (public.is_staff())
  with check (public.is_staff());

drop policy if exists "public read home category groups" on public.home_category_groups;
create policy "public read home category groups"
  on public.home_category_groups for select
  using (is_active = true);

drop policy if exists "staff manage home category groups" on public.home_category_groups;
create policy "staff manage home category groups"
  on public.home_category_groups for all
  using (public.is_staff())
  with check (public.is_staff());

drop policy if exists "public read home category group items" on public.home_category_group_items;
create policy "public read home category group items"
  on public.home_category_group_items for select
  using (is_active = true);

drop policy if exists "staff manage home category group items" on public.home_category_group_items;
create policy "staff manage home category group items"
  on public.home_category_group_items for all
  using (public.is_staff())
  with check (public.is_staff());

drop policy if exists "public read published products" on public.products;
create policy "public read published products"
  on public.products for select
  using (is_published = true);

drop policy if exists "staff manage products" on public.products;
create policy "staff manage products"
  on public.products for all
  using (public.is_staff())
  with check (public.is_staff());

drop policy if exists "public read product media" on public.product_media;
create policy "public read product media"
  on public.product_media for select
  using (
    exists (
      select 1
      from public.products p
      where p.id = product_id
        and p.is_published = true
    )
  );

drop policy if exists "staff manage product media" on public.product_media;
create policy "staff manage product media"
  on public.product_media for all
  using (public.is_staff())
  with check (public.is_staff());

drop policy if exists "public read product variants" on public.product_variants;
create policy "public read product variants"
  on public.product_variants for select
  using (
    is_active = true and exists (
      select 1
      from public.products p
      where p.id = product_id
        and p.is_published = true
    )
  );

drop policy if exists "staff manage product variants" on public.product_variants;
create policy "staff manage product variants"
  on public.product_variants for all
  using (public.is_staff())
  with check (public.is_staff());

drop policy if exists "public read product specs" on public.product_specs;
create policy "public read product specs"
  on public.product_specs for select
  using (
    exists (
      select 1
      from public.products p
      where p.id = product_id
        and p.is_published = true
    )
  );

drop policy if exists "staff manage product specs" on public.product_specs;
create policy "staff manage product specs"
  on public.product_specs for all
  using (public.is_staff())
  with check (public.is_staff());

drop policy if exists "public read product bullets" on public.product_bullets;
create policy "public read product bullets"
  on public.product_bullets for select
  using (
    exists (
      select 1
      from public.products p
      where p.id = product_id
        and p.is_published = true
    )
  );

drop policy if exists "staff manage product bullets" on public.product_bullets;
create policy "staff manage product bullets"
  on public.product_bullets for all
  using (public.is_staff())
  with check (public.is_staff());

drop policy if exists "public read product relations" on public.product_relations;
create policy "public read product relations"
  on public.product_relations for select
  using (
    exists (
      select 1
      from public.products p
      where p.id = product_id
        and p.is_published = true
    )
  );

drop policy if exists "staff manage product relations" on public.product_relations;
create policy "staff manage product relations"
  on public.product_relations for all
  using (public.is_staff())
  with check (public.is_staff());

drop policy if exists "public read approved reviews" on public.reviews;
create policy "public read approved reviews"
  on public.reviews for select
  using (is_approved = true);

drop policy if exists "users create reviews" on public.reviews;
create policy "users create reviews"
  on public.reviews for insert
  with check (auth.uid() = user_id);

drop policy if exists "users update own reviews" on public.reviews;
create policy "users update own reviews"
  on public.reviews for update
  using (auth.uid() = user_id or public.is_staff())
  with check (auth.uid() = user_id or public.is_staff());

drop policy if exists "users delete own reviews" on public.reviews;
create policy "users delete own reviews"
  on public.reviews for delete
  using (auth.uid() = user_id or public.is_staff());

drop policy if exists "users manage own wishlists" on public.wishlists;
create policy "users manage own wishlists"
  on public.wishlists for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "users manage own wishlist items" on public.wishlist_items;
create policy "users manage own wishlist items"
  on public.wishlist_items for all
  using (
    exists (
      select 1
      from public.wishlists w
      where w.id = wishlist_id
        and w.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.wishlists w
      where w.id = wishlist_id
        and w.user_id = auth.uid()
    )
  );

insert into public.site_settings (key, value, description)
values
  (
    'frontend_data',
    '{}'::jsonb,
    'Serialized storefront and admin-managed frontend content'
  ),
  (
    'navbar',
    jsonb_build_object(
      'logoUrl', '/logo.png',
      'logoAlt', 'Car Bazaar',
      'searchPlaceholder', 'Search here...'
    ),
    'Top navbar branding and search placeholder'
  ),
  (
    'latest_products_section',
    jsonb_build_object(
      'title', 'Latest Arrivals',
      'ctaLabel', 'View all',
      'ctaHref', '/products'
    ),
    'Homepage latest-products section labels'
  ),
  (
    'related_products_section',
    jsonb_build_object(
      'title', 'Products related to this item',
      'sponsoredLabel', 'Sponsored',
      'pageLabel', 'Page 1 of 1'
    ),
    'Product-detail related products section labels'
  )
on conflict (key) do nothing;

insert into public.stores (name, slug, support_email, is_active)
values ('Modern Electronics Ltd', 'modern-electronics', 'admin@modern.co.ug', true)
on conflict (slug) do nothing;
