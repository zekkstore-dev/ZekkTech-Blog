-- Migration: Add experiences table for About page
-- Run this in the Supabase SQL Editor:

CREATE TABLE IF NOT EXISTS experiences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT DEFAULT '',
  start_date TEXT NOT NULL,
  end_date TEXT DEFAULT 'Present',
  description TEXT DEFAULT '',
  type TEXT DEFAULT 'Kerja', -- Can be 'Kerja', 'Pendidikan', or 'Volunteers'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;

-- Drop policy if it already exists before creating to prevent errors
DROP POLICY IF EXISTS "Public can read experiences" ON experiences;
DROP POLICY IF EXISTS "Authenticated can manage experiences" ON experiences;

CREATE POLICY "Public can read experiences" ON experiences FOR SELECT USING (true);
CREATE POLICY "Authenticated can manage experiences" ON experiences FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Clean old seed data if table already exists
TRUNCATE TABLE experiences;

-- Sample seed data
INSERT INTO experiences (title, company, location, start_date, end_date, description, type) VALUES
('Sistem Informasi', 'Universitas Trunojoyo Madura', 'Bangkalan', '2020-09', '2024-09', 'Belajar Rekayasa Perangkat Lunak, Basis Data, dan Pengembangan Web.', 'Pendidikan'),
('Full-Stack Developer', 'PT Duta Asia Advertising', 'Jakarta', '2023-01', 'Present', 'Mengembangkan aplikasi web internal dan client-facing menggunakan React, Next.js, dan Supabase.', 'Kerja'),
('Frontend Developer', 'Freelance', 'Remote', '2021-06', '2022-12', 'Mengerjakan berbagai proyek website dan web app untuk klien dari berbagai industri.', 'Kerja'),
('Relawan IT Support', 'Komunitas Sosial', 'Surabaya', '2022-01', '2022-06', 'Membantu instalasi jaringan dan pemeliharaan perangkat keras.', 'Volunteers');