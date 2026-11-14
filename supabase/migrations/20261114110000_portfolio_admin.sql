create table if not exists public.portfolio_content (
  id text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now(),
  constraint portfolio_content_singleton check (id = 'main')
);

alter table public.portfolio_content enable row level security;

drop policy if exists "Portfolio is publicly readable" on public.portfolio_content;
create policy "Portfolio is publicly readable"
  on public.portfolio_content
  for select
  to anon, authenticated
  using (true);

grant select on public.portfolio_content to anon, authenticated;
grant insert, update, delete on public.portfolio_content to authenticated;

create table if not exists public.portfolio_admins (
  user_id uuid primary key references auth.users (id) on delete cascade
);

alter table public.portfolio_admins enable row level security;

drop policy if exists "Admins can read their own role" on public.portfolio_admins;
create policy "Admins can read their own role"
  on public.portfolio_admins
  for select
  to authenticated
  using (user_id = (select auth.uid()));

grant select on public.portfolio_admins to authenticated;

drop policy if exists "Admins can manage portfolio content" on public.portfolio_content;
create policy "Admins can manage portfolio content"
  on public.portfolio_content
  for all
  to authenticated
  using (
    exists (
      select 1
      from public.portfolio_admins
      where user_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1
      from public.portfolio_admins
      where user_id = (select auth.uid())
    )
  );

insert into storage.buckets (id, name, public, allowed_mime_types)
values (
  'portfolio-media',
  'portfolio-media',
  true,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf']
)
on conflict (id) do update
set
  public = excluded.public,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Portfolio media is publicly readable" on storage.objects;
create policy "Portfolio media is publicly readable"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'portfolio-media');

drop policy if exists "Portfolio admins can upload media" on storage.objects;
create policy "Portfolio admins can upload media"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'portfolio-media'
    and exists (
      select 1
      from public.portfolio_admins
      where user_id = (select auth.uid())
    )
  );

drop policy if exists "Portfolio admins can update media" on storage.objects;
create policy "Portfolio admins can update media"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'portfolio-media'
    and exists (
      select 1
      from public.portfolio_admins
      where user_id = (select auth.uid())
    )
  )
  with check (
    bucket_id = 'portfolio-media'
    and exists (
      select 1
      from public.portfolio_admins
      where user_id = (select auth.uid())
    )
  );

drop policy if exists "Portfolio admins can delete media" on storage.objects;
create policy "Portfolio admins can delete media"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'portfolio-media'
    and exists (
      select 1
      from public.portfolio_admins
      where user_id = (select auth.uid())
    )
  );

insert into public.portfolio_content (id, data)
values (
  'main',
  '{
    "siteName": "Ezequias Gs Costa",
    "heroBackgroundUrl": "/eren.png",
    "bio": {
      "facts": ["27 Anos", "Casado", "Casa Propria", "Veiculo", "Musico", "Gamer"],
      "imageUrl": "/eren.png"
    },
    "contacts": [
      {"id": "email", "label": "EMAIL", "url": ""},
      {"id": "github", "label": "GITHUB", "url": ""},
      {"id": "whatsapp", "label": "WHATSAPP", "url": ""},
      {"id": "linkedin", "label": "LINKEDIN", "url": ""},
      {"id": "instagram", "label": "INSTAGRAM", "url": ""}
    ],
    "projects": [
      {"id": "projeto-inicial", "name": "Projeto 1", "url": "https://cantinhodavih.vercel.app/"}
    ],
    "certificates": [],
    "extension": [
      {"id": "extensao-inicial", "name": "Projeto 1", "url": "https://cantinhodavih.vercel.app/"}
    ]
  }'::jsonb
)
on conflict (id) do nothing;

-- Create an Auth user first, then grant admin access with:
-- insert into public.portfolio_admins (user_id)
-- select id from auth.users where email = 'SEU_EMAIL_ADMIN';
