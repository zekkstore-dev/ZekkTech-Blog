import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Pakai Service Role Key biar punya akses "Tuhan" hapus/tambah abaikan Rules RLS
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Kesalahan: Variabel URL atau Key Supabase kamu belum diatur di .env.local bro!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// ==========================================
// DATA DUMMY CONTOH
// ==========================================

// 1. DATA PENULIS (AUTHORS)
const seedAuthors = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    name: 'Zakaria',
    bio: 'Tech enthusiast and lead author at ZekkTech Blog.',
    avatar_url: '/images/person-learn-coding.svg'
  }
];

// 2. DATA ARTIKEL
export const seedPosts = [
  {
    id: '22222222-2222-2222-2222-222222222221',
    title: 'Framework Javascript Terbaik di Tahun Ini',
    slug: 'framework-javascript-terbaik',
    content: 'Review lengkap tentang framework Javascript terbaru yang wajib dicoba oleh developer web modern.',
    excerpt: 'Review lengkap tentang framework Javascript terbaru.',
    cover_url: null,
    category: 'Berita Teknologi',
    author_id: '11111111-1111-1111-1111-111111111111',
    author_name: 'Zakaria',
    reading_time: 4,
    featured: false,
    published: true,
    created_at: '2025-02-12T08:00:00Z',
    updated_at: '2025-02-12T08:00:00Z',
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    title: 'Cara Setup Supabase di Proyek Next.js',
    slug: 'setup-supabase-nextjs',
    content: 'Tutorial langkah demi langkah untuk mengintegrasikan backend Supabase ke aplikasi Next.js Anda mulai dari inisialisasi hingga auth.',
    excerpt: 'Langkah demi langkah mengintegrasikan backend Supabase ke aplikasi Next.js.',
    cover_url: null,
    category: 'Tutorial Teknologi',
    author_id: '11111111-1111-1111-1111-111111111111',
    author_name: 'Zakaria',
    reading_time: 6,
    featured: true,
    published: true,
    created_at: '2025-02-12T09:00:00Z',
    updated_at: '2025-02-12T09:00:00Z',
  },
  {
    id: '22222222-2222-2222-2222-222222222223',
    title: 'Template Admin Dashboard Gratis (Tailwind CSS)',
    slug: 'template-admin-dashboard-gratis',
    content: 'Download template admin dashboard siap pakai menggunakan Tailwind CSS dan React terbaik.',
    excerpt: 'Download template admin dashboard siap pakai menggunakan Tailwind CSS.',
    cover_url: '/images/react-demo.svg',
    category: 'Template',
    author_id: '11111111-1111-1111-1111-111111111111',
    author_name: 'Zakaria',
    reading_time: 3,
    featured: false,
    published: true,
    created_at: '2025-02-12T10:00:00Z',
    updated_at: '2025-02-12T10:00:00Z',
  },
  {
    id: '22222222-2222-2222-2222-222222222224',
    title: '5 Tips Menjadi Developer Senior',
    slug: 'tips-menjadi-developer-senior',
    content: 'Opini dan insight mendalam seputar pergeseran mindset dari sekedar coder menjadi problem solver yang andal di industri.',
    excerpt: 'Insight mendalam seputar pergeseran mindset programmer handal.',
    cover_url: null,
    category: 'Pilihan Editor',
    author_id: '11111111-1111-1111-1111-111111111111',
    author_name: 'Zakaria',
    reading_time: 7,
    featured: true,
    published: true,
    created_at: '2025-02-12T11:00:00Z',
    updated_at: '2025-02-12T11:00:00Z',
  }
];

// 3. DATA KOMENTAR
const seedComments = [
  {
    post_id: '22222222-2222-2222-2222-222222222222',
    user_name: 'Budi Santoso',
    content: 'Wah, tutorialnya sangat mudah dipahami! Terima kasih mas.',
  },
  {
    post_id: '22222222-2222-2222-2222-222222222223',
    user_name: 'Ahmad Faiz',
    content: 'Izin download templatenya ya bos!',
  }
];

// 4. DATA EMAIL SUBSCRIBER
const seedSubscribers = [
  { email: 'budi.santoso@example.com' },
  { email: 'developer.keren@example.com' }
];

// 5. DATA PENGUNJUNG ANALITIK
const seedPageViews = [
  { post_id: '22222222-2222-2222-2222-222222222222', ip_address: '192.168.1.1', user_agent: 'Chrome/118.0' },
  { post_id: '22222222-2222-2222-2222-222222222222', ip_address: '192.168.1.5', user_agent: 'Safari/17.0' },
  { post_id: '22222222-2222-2222-2222-222222222223', ip_address: '10.0.0.8', user_agent: 'Firefox/119.0' },
  { ip_address: '192.168.1.12', user_agent: 'Chrome/118.0' } // Kunjungan halaman Beranda (post_id null)
];


async function seed() {
  console.log('🔄 Lagi bersihin data lama di Supabase nih (sistem cascade berurut dari bawah biar aman dari Foreign Key)...');
  
  // Mengosongkan data secara perlahan beruntun
  await supabase.from('page_views').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('subscribers').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('comments').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('posts').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('authors').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  console.log('✍️ Ngisi data Penulis...');
  await supabase.from('authors').insert(seedAuthors);

  console.log('📰 Ngisi data Artikel Baru...');
  await supabase.from('posts').insert(seedPosts);

  console.log('💬 Ngisi Contoh Komentar...');
  await supabase.from('comments').insert(seedComments);

  console.log('📧 Ngisi Kumpulan Email...');
  await supabase.from('subscribers').insert(seedSubscribers);

  console.log('👁️ Ngisi Catatan Analitik...');
  await supabase.from('page_views').insert(seedPageViews);

  console.log('🚀 Mantap! Semua data contoh udah bersih terunggah ke database.');
}

// Biar tau kala diconnect via terminal langsung jalan
if (process.argv[1] && process.argv[1].includes('seed.mjs')) {
    seed();
}
