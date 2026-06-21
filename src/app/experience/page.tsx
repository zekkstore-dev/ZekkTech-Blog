import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ExperienceTimeline from '@/components/ExperienceTimeline';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Pengalaman Profesional Zakaria Mujur Prasetyo | ZekkTech',
  description: 'Daftar riwayat pengalaman kerja, pendidikan, dan kontribusi relawan Zakaria Mujur Prasetyo (Zekktech) sebagai software developer.',
  alternates: {
    canonical: '/experience',
  },
  openGraph: {
    title: 'Pengalaman Profesional Zakaria Mujur Prasetyo | ZekkTech',
    description: 'Daftar riwayat pengalaman kerja, pendidikan, dan kontribusi relawan Zakaria Mujur Prasetyo (Zekktech) sebagai software developer.',
    url: '/experience',
    type: 'website',
  },
  twitter: {
    title: 'Pengalaman Profesional Zakaria Mujur Prasetyo | ZekkTech',
    description: 'Daftar riwayat pengalaman kerja, pendidikan, dan kontribusi relawan Zakaria Mujur Prasetyo (Zekktech) sebagai software developer.',
  },
};

interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  start_date: string;
  end_date: string;
  description: string;
  type: string;
}

async function getExperiences(): Promise<Experience[]> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl || supabaseUrl.includes('your-project')) return [];
    
    const { createServerSupabaseClient } = await import('@/lib/supabase/server');
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase
      .from('experiences')
      .select('*')
      .order('start_date', { ascending: false });
    
    return (data as Experience[]) ?? [];
  } catch (error) {
    console.error('Error fetching experiences:', error);
    return [];
  }
}

export default async function ExperiencePage() {
  const experiences = await getExperiences();

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] transition-colors duration-300">
      <Navbar />

      <div className="max-w-[850px] mx-auto px-6 py-12 md:py-20 animate-fade-in-up">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex p-3 rounded-2xl bg-sky-50 dark:bg-sky-950/30 text-[#0ea5e9] mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-white mb-4">
            Pengalaman & Perjalanan
          </h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm max-w-lg mx-auto leading-relaxed">
            Perjalanan karir, pendidikan formal, serta kontribusi relawan dan organisasi saya.
          </p>
        </div>

        {/* Timeline */}
        <ExperienceTimeline experiences={experiences} title="Riwayat Pengalaman" maxItems={100} showViewAll={false} />
      </div>

      <Footer />
    </main>
  );
}
