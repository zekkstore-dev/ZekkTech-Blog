import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import type { Portfolio } from '@/types/portfolio';
import PortofolioGrid from '@/components/PortofolioGrid';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Portofolio Zakaria Mujur Prasetyo | ZekkTech',
  description: 'Kumpulan proyek portofolio software engineering dan web development yang dikerjakan oleh Zakaria Mujur Prasetyo (Zekktech).',
  alternates: {
    canonical: '/portofolio',
  },
  openGraph: {
    title: 'Portofolio Zakaria Mujur Prasetyo | ZekkTech',
    description: 'Kumpulan proyek portofolio software engineering dan web development yang dikerjakan oleh Zakaria Mujur Prasetyo (Zekktech).',
    url: '/portofolio',
    type: 'website',
  },
  twitter: {
    title: 'Portofolio Zakaria Mujur Prasetyo | ZekkTech',
    description: 'Kumpulan proyek portofolio software engineering dan web development yang dikerjakan oleh Zakaria Mujur Prasetyo (Zekktech).',
  },
};

async function getPortfolios() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (supabaseUrl && !supabaseUrl.includes('your-project')) {
      const { createServerSupabaseClient } = await import('@/lib/supabase/server');
      const supabase = await createServerSupabaseClient();
      const { data } = await supabase.from('portfolios').select('*').order('created_at', { ascending: false });
      if (data) {
        return data as Portfolio[];
      }
    }
  } catch (error) {
    console.error('Error fetching portfolios', error);
  }
  return [];
}

export default async function PortofolioPage() {
  const portfolios = await getPortfolios();

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] transition-colors duration-300">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-12 md:py-20">
        <PortofolioGrid portfolios={portfolios} maxItems={8} showViewAll={true} expandOnClick={true} title="Semua Portofolio" />
      </div>
      <Footer />
    </main>
  );
}
