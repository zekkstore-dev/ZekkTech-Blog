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
  type TEXT DEFAULT 'Full-time',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read experiences" ON experiences FOR SELECT USING (true);
CREATE POLICY "Authenticated can manage experiences" ON experiences FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Sample seed data
INSERT INTO experiences (title, company, location, start_date, end_date, description, type) VALUES
('Full-Stack Developer', 'PT Duta Asia Advertising', 'Jakarta', '2023-01', 'Present', 'Mengembangkan aplikasi web internal dan client-facing menggunakan React, Next.js, dan Supabase.', 'Full-time'),
('Frontend Developer', 'Freelance', 'Remote', '2021-06', '2022-12', 'Mengerjakan berbagai proyek website dan web app untuk klien dari berbagai industri.', 'Freelance'),
('Web Developer Intern', 'Digital Agency', 'Jakarta', '2020-03', '2021-05', 'Belajar dan berkontribusi dalam pengembangan website menggunakan HTML, CSS, JavaScript, dan PHP.', 'Internship');