import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase URL or Key in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const seedPosts = [
  {
    title: 'Javascript Tingkat Lanjut',
    slug: 'javascript-tingkat-lanjut',
    content: 'Pelajari konsep-konsep tingkat lanjut dalam Javascript seperti closure, prototype chain, event loop, dan masih banyak lagi. Artikel ini akan membahas secara mendalam tentang bagaimana Javascript bekerja di balik layar dan bagaimana memanfaatkan fitur-fitur canggih untuk menulis kode yang lebih baik.',
    excerpt: 'Pelajari konsep-konsep tingkat lanjut dalam Javascript seperti closure, prototype chain, dan event loop.',
    cover_url: null,
    category: 'Pilihan Editor',
    author_name: 'Kadek Surya',
    reading_time: 5,
    featured: true,
    published: true,
    created_at: '2025-02-12T08:00:00Z',
    updated_at: '2025-02-12T08:00:00Z',
  },
  {
    title: 'Mengenal CSS Grid',
    slug: 'mengenal-css-grid',
    content: 'CSS Grid adalah sistem layout dua dimensi yang powerful untuk membangun layout web modern. Dengan CSS Grid, kamu bisa membuat layout kompleks dengan kode yang lebih bersih dan lebih mudah dipahami.',
    excerpt: 'CSS Grid adalah sistem layout dua dimensi yang powerful untuk membangun layout web modern.',
    cover_url: null,
    category: 'Pilihan Editor',
    author_name: 'Kadek Surya',
    reading_time: 5,
    featured: true,
    published: true,
    created_at: '2025-02-12T08:00:00Z',
    updated_at: '2025-02-12T08:00:00Z',
  },
  {
    title: 'Animasi CSS Untuk Pemula',
    slug: 'animasi-css-untuk-pemula',
    content: 'Belajar membuat animasi yang menarik menggunakan CSS. Dari transisi sederhana hingga keyframe animations yang kompleks, pelajari cara membuat website kamu lebih hidup dan interaktif.',
    excerpt: 'Belajar membuat animasi yang menarik menggunakan CSS transitions dan keyframes.',
    cover_url: null,
    category: 'Pilihan Editor',
    author_name: 'Kadek Surya',
    reading_time: 8,
    featured: true,
    published: true,
    created_at: '2025-02-12T08:00:00Z',
    updated_at: '2025-02-12T08:00:00Z',
  },
  {
    title: 'React JS Untuk Pemula',
    slug: 'react-js-untuk-pemula',
    content: 'Panduan lengkap untuk memulai belajar React JS dari nol. Pelajari dasar-dasar React seperti components, props, state, dan hooks. Cocok untuk yang baru memulai perjalanan frontend development.',
    excerpt: 'Panduan lengkap untuk memulai belajar React JS dari nol.',
    cover_url: null,
    category: 'Pilihan Editor',
    author_name: 'Kadek Surya',
    reading_time: 5,
    featured: true,
    published: true,
    created_at: '2025-02-12T08:00:00Z',
    updated_at: '2025-02-12T08:00:00Z',
  },
  {
    title: 'CSS Flexbox Lengkap',
    slug: 'css-flexbox-lengkap',
    content: 'Panduan lengkap tentang CSS Flexbox. Pelajari cara menggunakan flex container, flex items, dan semua properti yang terkait untuk membuat layout yang responsif dan fleksibel.',
    excerpt: 'Panduan lengkap tentang CSS Flexbox untuk layout yang responsif.',
    cover_url: null,
    category: 'CSS Dasar',
    author_name: 'Kadek Surya',
    reading_time: 5,
    featured: false,
    published: true,
    created_at: '2025-02-12T08:00:00Z',
    updated_at: '2025-02-12T08:00:00Z',
  },
  {
    title: 'Array Pada Javascript',
    slug: 'array-pada-javascript',
    content: 'Panduan lengkap tentang Array di Javascript. Pelajari cara membuat, memanipulasi, dan menggunakan method-method array seperti map, filter, reduce, dan masih banyak lagi.',
    excerpt: 'Panduan lengkap tentang Array dan method-methodnya di Javascript.',
    cover_url: null,
    category: 'Javascript Tingkat Dasar',
    author_name: 'Kadek Surya',
    reading_time: 5,
    featured: false,
    published: true,
    created_at: '2025-02-12T08:00:00Z',
    updated_at: '2025-02-12T08:00:00Z',
  },
  {
    title: 'Belajar React JS Di Bulan Pertama',
    slug: 'belajar-react-js-di-bulan-pertama',
    content: 'Pengalaman dan tips belajar React JS di bulan pertama. Dari setup environment hingga membuat komponen pertama, pelajari langkah-langkah yang efektif.',
    excerpt: 'Pengalaman dan tips belajar React JS dari nol di bulan pertama.',
    cover_url: '/images/react-demo.svg',
    category: 'React JS',
    author_name: 'Kadek Surya',
    reading_time: 5,
    featured: false,
    published: true,
    created_at: '2025-02-12T08:00:00Z',
    updated_at: '2025-02-12T08:00:00Z',
  }
];

async function seed() {
  console.log('Seeding Supabase Database...');
  
  // Clear existing
  const { error: deleteError } = await supabase.from('posts').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (deleteError) {
    console.error('Error clearing posts:', deleteError);
  }

  // Insert
  const { data, error } = await supabase.from('posts').insert(seedPosts).select();
  
  if (error) {
    console.error('Error inserting posts:', error);
  } else {
    console.log(`Successfully seeded ${data.length} posts to Supabase!`);
  }
}

seed();
