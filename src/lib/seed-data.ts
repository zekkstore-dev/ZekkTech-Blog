import type { Post } from '@/types/post';

/**
 * Minimal Fresh Seed Data for Local Rendering.
 * This mirrors the new minimal subset in supabase/seed.mjs
 */
export const seedPosts: Post[] = [
  {
    id: '22222222-2222-2222-2222-222222222221',
    title: 'Framework Javascript Terbaik di Tahun Ini',
    slug: 'framework-javascript-terbaik',
    content: 'Review lengkap tentang framework Javascript terbaru yang wajib dicoba oleh developer web modern.',
    excerpt: 'Review lengkap tentang framework Javascript terbaru.',
    cover_url: null,
    category: 'Berita Teknologi',
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
    author_name: 'Zakaria',
    reading_time: 7,
    featured: true,
    published: true,
    created_at: '2025-02-12T11:00:00Z',
    updated_at: '2025-02-12T11:00:00Z',
  }
];
