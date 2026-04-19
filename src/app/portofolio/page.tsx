import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import type { Portfolio } from '@/types/portfolio';

export const metadata = {
  title: 'Portofolio | ZekkTech',
  description: 'Kumpulan proyek portofolio yang pernah dikerjakan.',
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

      <article className="max-w-[1100px] mx-auto px-6 py-12 md:py-20 animate-fade-in-up">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-800  mb-6">Portofolio & Proyek</h1>
          <p className="text-slate-500 dark:text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Eksplorasi kumpulan karya terbaik saya. <br/> Dari aplikasi marketplace hingga Program ada di sini.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {portfolios.length === 0 ? (
            <div className="col-span-full py-16 text-center text-slate-500 dark:text-gray-400 bg-[var(--bg-secondary)] border border-dashed border-gray-200  rounded-3xl flex flex-col items-center justify-center gap-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-50"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
              <p className="text-sm">Belum ada proyek portofolio.<br/><span className="text-xs">Silakan buat dan atur portofolio di Dashboard Admin.</span></p>
            </div>
          ) : (
            portfolios.map(port => (
              <div key={port.id} className="relative group bg-[var(--bg-secondary)] rounded-2xl overflow-hidden shadow-sm hover:shadow-md dark:shadow-none dark:hover:shadow-sky-500/5 border border-gray-100  transition-all duration-300 hover:-translate-y-1 flex flex-col">
                
                {/* Image Header with Badge */}
                <div className="w-full h-28 lg:h-36 overflow-hidden relative bg-slate-100 dark:bg-slate-800">
                  {port.image_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={port.image_url} alt={port.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  )}
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-0.5 bg-teal-100/90 backdrop-blur-md text-teal-700 text-[9px] font-bold ring-1 ring-inset ring-teal-600/20 rounded-full shadow-sm">Completed</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-3 flex flex-col flex-1">
                  <div className="flex justify-between items-start gap-2 mb-1.5">
                    <h3 className="font-extrabold text-[#1f2937] text-sm line-clamp-1">{port.title}</h3>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-300 dark:text-slate-600 shrink-0"><path d="M7 17l9.2-9.2M17 17V7H7"/></svg>
                  </div>
                  
                  <p className="text-slate-500 dark:text-gray-400 text-xs line-clamp-3 leading-relaxed">
                    {port.description}
                  </p>
                  
                  <div className="flex-1 min-h-[12px]"></div>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-3 max-h-[40px] overflow-hidden">
                    {port.tags && port.tags.map(tag => (
                      <span key={tag} className="px-1.5 py-0.5 bg-sky-50 dark:bg-sky-900/30 text-[#0ea5e9] dark:text-sky-300 border border-sky-100 dark:border-sky-800/50 rounded-md text-[9px] font-bold">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <a href={port.repo_url || '#'} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5 px-2 py-1.5 bg-white dark:bg-transparent border border-slate-200  text-slate-600 dark:text-gray-300 hover:text-[#0ea5e9] hover:border-[#0ea5e9] rounded-md text-[11px] font-bold transition-colors">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                      Github
                    </a>
                    <a href={port.demo_url || '#'} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5 px-2 py-1.5 bg-[#0ea5e9] hover:bg-[#0284c7] text-white rounded-md text-[11px] font-bold transition-colors">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/></svg>
                      Demo
                    </a>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </article>

      <Footer />
    </main>
  );
}
