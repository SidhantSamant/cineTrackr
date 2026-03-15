create table public.app_versions (
  id serial primary key,
  platform text not null unique,
  latest_version text not null,
  min_required_version text not null,
  update_url text not null,
  release_notes text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row Level Security (RLS)
alter table public.app_versions enable row level security;

create policy "Public read" 
on public.app_versions 
for select 
using (true);