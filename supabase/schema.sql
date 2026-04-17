-- Skema Database ZekkTech Blog
-- Jalankan file ini di Supabase SQL Editor

-- 1. Tabel AUTHORS (Daftar Penulis)
CREATE TABLE IF NOT EXISTS authors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabel POSTS (Daftar Artikel)
CREATE TABLE IF NOT EXISTS posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  cover_url TEXT,
  category TEXT DEFAULT 'Uncategorized',
  author_id UUID REFERENCES authors(id) ON DELETE SET NULL,
  author_name TEXT DEFAULT 'ZekkTech Admin', -- dipertahankan agar UI lama tidak error
  reading_time INT DEFAULT 5,
  featured BOOLEAN DEFAULT FALSE,
  published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bikin indeks pencarian biar loading routing Next.js lebih ngebut
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts (slug);
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts (category);
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts (published);

-- 3. Tabel COMMENTS (Daftar Komentar)
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments (post_id);

-- 4. Tabel SUBSCRIBERS (Kumpulan Email Newsletter)
CREATE TABLE IF NOT EXISTS subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Tabel PAGE VIEWS (Analitik Pengunjung)
CREATE TABLE IF NOT EXISTS page_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE, -- Kalau isinya NULL berarti dia nge-visit halaman beranda
  ip_address TEXT, 
  user_agent TEXT,
  viewed_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) - Keamanan Tabel
-- ==========================================

ALTER TABLE authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- Pengunjung biasa boleh baca profil penulis
CREATE POLICY "Public can read authors" ON authors FOR SELECT USING (true);

-- Pengunjung biasa cuma boleh baca artikel yang statusnya 'published'
CREATE POLICY "Public can read published posts" ON posts FOR SELECT USING (published = true);
-- Kalau dia Admin (sudah Login), bebas ngapain aja
CREATE POLICY "Authenticated users can do everything" ON posts FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Pengunjung bebas baca komentar artikel dan nulis komentar baru
CREATE POLICY "Public can read comments" ON comments FOR SELECT USING (true);
CREATE POLICY "Public can insert comments" ON comments FOR INSERT WITH CHECK (true);

-- Pengaturan Kumpulan Email: Pengunjung bebas nambahin email mereka
CREATE POLICY "Public can insert subscribers" ON subscribers FOR INSERT WITH CHECK (true);
-- TAPI cuma admin yang berhak menarik (baca) data tabel email
CREATE POLICY "Admins read subscribers" ON subscribers FOR SELECT USING (auth.role() = 'authenticated');

-- Pengaturan Analitik: script boleh ngirim data pas ada yang visit
CREATE POLICY "Public can insert page views" ON page_views FOR INSERT WITH CHECK (true);
-- TAPI cuma admin yang berhak ngecek list record kunjungannya
CREATE POLICY "Admins read views" ON page_views FOR SELECT USING (auth.role() = 'authenticated');

-- ==========================================
-- FUNGSI & TRIGGERS (Automasi Update)
-- ==========================================

-- Bikin fungsi biar kolom updated_at otomatis keisi tanggal terbaru kapanpun diedit
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER posts_updated_at BEFORE UPDATE ON posts FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER comments_updated_at BEFORE UPDATE ON comments FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER authors_updated_at BEFORE UPDATE ON authors FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ==========================================
-- FUNGSI BYPASS UNTUK PENGECEKAN SUBSCRIBER
-- ==========================================
-- Karena tabel 'subscribers' disetel agar publik *tidak bisa* nge-SELECT (buat ngelindungin data privasi email), 
-- kita butuh fitur aman buat Frontend nanyain "Eh, email ini terdaftar gak ya?". 
-- Makanya kita pakai SECURITY DEFINER (mirip nge-run as Admin di belakang layar).

CREATE OR REPLACE FUNCTION check_is_subscriber(check_email TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM subscribers WHERE email = check_email);
END;
$$;

-- ==========================================
-- TABEL SITE SETTINGS (Konfigurasi Website)
-- ==========================================
-- buat nyimpen data dinamis kayak konten "Tentang Saya" dll
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read site_settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Authenticated can manage site_settings" ON site_settings FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

CREATE TRIGGER site_settings_updated_at BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at();