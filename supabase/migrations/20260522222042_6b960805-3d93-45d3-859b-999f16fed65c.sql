
ALTER TABLE public.links ADD COLUMN IF NOT EXISTS image_url text;

INSERT INTO storage.buckets (id, name, public)
VALUES ('link-images', 'link-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Link images are publicly viewable"
ON storage.objects FOR SELECT
USING (bucket_id = 'link-images');

CREATE POLICY "Users can upload their own link images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'link-images'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own link images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'link-images'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own link images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'link-images'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
