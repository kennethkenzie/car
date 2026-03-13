alter table "Vehicle"
add column if not exists "isFeatured" boolean not null default false;

create index if not exists "Vehicle_isFeatured_idx"
on "Vehicle"("isFeatured");
