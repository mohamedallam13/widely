-- Create link-images bucket (idempotent)
insert into storage.buckets (id, name, public)
values ('link-images', 'link-images', true)
on conflict (id) do nothing;

-- Create avatars bucket (idempotent)
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Drop and recreate all link-images policies cleanly
drop policy if exists "Link images are publicly viewable" on storage.objects;
drop policy if exists "Users can upload their own link images" on storage.objects;
drop policy if exists "Users can update their own link images" on storage.objects;
drop policy if exists "Users can delete their own link images" on storage.objects;

create policy "Link images are publicly viewable"
on storage.objects for select
using (bucket_id = 'link-images');

create policy "Users can upload their own link images"
on storage.objects for insert
with check (
  bucket_id = 'link-images'
  and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "Users can update their own link images"
on storage.objects for update
using (
  bucket_id = 'link-images'
  and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "Users can delete their own link images"
on storage.objects for delete
using (
  bucket_id = 'link-images'
  and auth.uid()::text = (storage.foldername(name))[1]
);

-- Drop and recreate all avatars policies cleanly
drop policy if exists "Avatars are publicly viewable" on storage.objects;
drop policy if exists "Users can upload their own avatar" on storage.objects;
drop policy if exists "Users can update their own avatar" on storage.objects;
drop policy if exists "Users can delete their own avatar" on storage.objects;

create policy "Avatars are publicly viewable"
on storage.objects for select
using (bucket_id = 'avatars');

create policy "Users can upload their own avatar"
on storage.objects for insert
with check (
  bucket_id = 'avatars'
  and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "Users can update their own avatar"
on storage.objects for update
using (
  bucket_id = 'avatars'
  and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "Users can delete their own avatar"
on storage.objects for delete
using (
  bucket_id = 'avatars'
  and auth.uid()::text = (storage.foldername(name))[1]
);
