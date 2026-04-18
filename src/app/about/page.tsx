import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Portfolio } from '@/types/portfolio';

export const metadata = {
  title: 'Tentang Saya | ZekkTech',
  description: 'Profil, Portofolio, dan Sertifikat kreator ZekkTech Blog.',
};

const fallbackContent = `Halo! Selamat datang di halaman profil kreator **ZekkTech Blog**.`;

// Fetching functions
async function getPageData() {
  const defaultProfile = {
    name: 'ZakariaMP',
    job: 'Full-Stack Developer',
    avatar: '/images/person-learn-coding.svg',
    bio: 'Seorang tech enthusiast yang gemar berbagi wawasan baru seputar web development, desain UI/UX, dan teknologi modern.',
    techs: ['ReactJS', 'NextJS', 'TailwindCSS', 'TypeScript', 'Node.js'],
    cv_url: '',
    cert_url: '',
    markdown: fallbackContent,
  };

  const data = { profile: defaultProfile, portfolios: [] as Portfolio[] };

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl || supabaseUrl.includes('your-project')) {
      return data;
    }

    const { createServerSupabaseClient } = await import('@/lib/supabase/server');
    const supabase = await createServerSupabaseClient();
    
    // Fetch Settings
    const { data: settings } = await supabase.from('site_settings').select('key, value');
    if (settings && settings.length > 0) {
      settings.forEach(s => {
        if (s.key === 'profile_name') data.profile.name = s.value;
        if (s.key === 'profile_job') data.profile.job = s.value;
        if (s.key === 'profile_avatar' && s.value) data.profile.avatar = s.value;
        if (s.key === 'profile_bio') data.profile.bio = s.value;
        if (s.key === 'profile_techs') data.profile.techs = JSON.parse(s.value || '[]');
        if (s.key === 'profile_cv') data.profile.cv_url = s.value;
        if (s.key === 'profile_cert') data.profile.cert_url = s.value;
        if (s.key === 'about_content') data.profile.markdown = s.value;
      });
    }

    // Fetch Portfolios
    const { data: ports } = await supabase.from('portfolios').select('*').order('created_at', { ascending: false });
    if (ports) {
      data.portfolios = ports as Portfolio[];
    }
  } catch (err) {
    console.error(err);
  }

  return data;
}

export default async function AboutPage() {
  const { profile, portfolios } = await getPageData();

  return (
    <main className="about-page min-h-screen bg-[var(--bg-primary)] transition-colors duration-300">
      <Navbar />

      <article className="max-w-[900px] mx-auto px-6 py-12 md:py-20 animate-fade-in-up">
        
        {/* ================= Profil Section ================= */}
        <div id="profil" className="mb-20 scroll-mt-24">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Left Column: Avatar & Download CTA */}
            <div className="w-full md:w-64 flex flex-col items-center shrink-0">
              <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-3xl overflow-hidden border-[6px] border-white dark:border-[#1a1d24] shadow-xl relative mb-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
              </div>
              <h1 className="text-2xl font-extrabold text-slate-800  mb-1">{profile.name}</h1>
              <p className="text-slate-500 dark:text-gray-400 font-medium mb-6 text-sm">{profile.job}</p>
              
              <a href={profile.cv_url ? `/resume?doc=cv` : '#'} className={`w-full flex items-center justify-center gap-2 px-6 py-3 font-bold rounded-xl shadow-lg transition-all ${profile.cv_url ? "bg-[#0ea5e9] hover:bg-[#0284c7] text-white shadow-sky-500/30 hover:-translate-y-0.5" : "bg-gray-200 dark:bg-gray-800 text-gray-500 cursor-not-allowed shadow-none"}`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                {profile.cv_url ? "Download CV" : "CV Belum Diunggah"}
              </a>
            </div>

            {/* Right Column: Hello, Bio & Buttons */}
            <div className="flex-1 w-full bg-[var(--bg-secondary)] rounded-3xl p-8 shadow-sm border border-gray-100 /50">
              <h2 className="text-3xl font-extrabold text-slate-800  mb-4 flex items-center gap-2">
                Hello! <span>👋</span>
              </h2>
              <p className="text-slate-600 dark:text-gray-300 leading-relaxed mb-6 text-[15px]">
                {profile.bio}
              </p>
              
              {/* Utility Buttons (Resume/Cert) */}
              <div className="flex flex-wrap gap-3 mb-8 pb-8 border-b border-gray-100 ">
                <a href={profile.cert_url ? `/resume?doc=cert` : '#'} className={`inline-flex items-center gap-2 px-4 py-2 border rounded-lg font-medium text-sm transition-all shadow-sm ${profile.cert_url ? "border-slate-200  bg-white dark:bg-[#252830] text-slate-700 dark:text-gray-300 hover:border-[#0ea5e9] hover:text-[#0ea5e9]" : "border-dashed border-gray-200  text-gray-400 bg-transparent cursor-not-allowed"}`}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  My Sertificate
                </a>
                <a href={profile.cv_url ? `/resume?doc=cv` : '#'} className={`inline-flex items-center gap-2 px-4 py-2 border rounded-lg font-medium text-sm transition-all shadow-sm ${profile.cv_url ? "border-slate-200  bg-white dark:bg-[#252830] text-slate-700 dark:text-gray-300 hover:border-[#0ea5e9] hover:text-[#0ea5e9]" : "border-dashed border-gray-200  text-gray-400 bg-transparent cursor-not-allowed"}`}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                  My Resume
                </a>
              </div>

              {/* Tech Stack Horizontal List */}
              <h3 className="text-lg font-bold text-slate-800  mb-4">Tech Stack</h3>
              <div className="flex flex-wrap gap-2">
                {profile.techs.map((tech) => (
                  <span key={tech} className="px-4 py-2 bg-slate-50 dark:bg-[#252830] border border-slate-200  text-slate-700 dark:text-gray-300 text-xs font-bold rounded-lg shadow-sm">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ================= Markdown Story ================= */}
        {profile.markdown && (
          <div className="mb-20 bg-[var(--bg-secondary)] p-8 rounded-3xl shadow-sm border border-gray-100 /50">
            <h2 className="text-xl font-bold text-slate-800  mb-6">Tentang Perjalanan Saya</h2>
            <div className="prose prose-slate max-w-none text-[15px] leading-relaxed text-slate-600 dark:text-gray-300 [&>p]:text-slate-600 dark:[&>p]:text-gray-300 [&>ul]:text-slate-600 dark:[&>ul]:text-gray-300 [&>ol]:text-slate-600 dark:[&>ol]:text-gray-300 [&_strong]:text-slate-800 dark:[&_strong]:text-gray-100 [&_h2]:text-slate-800 dark:[&_h2]:text-gray-100 [&_h3]:text-slate-800 dark:[&_h3]:text-gray-100">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {profile.markdown}
              </ReactMarkdown>
            </div>
          </div>
        )}

        {/* ================= Portofolio Section ================= */}
        <div id="portofolio" className="mb-24 scroll-mt-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-slate-800  mb-4">Portofolio & Proyek</h2>
            <p className="text-slate-500 dark:text-gray-400">Some of the best works I&apos;ve completed for clients</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {portfolios.length === 0 ? (
              <div className="col-span-full py-16 text-center text-slate-500 dark:text-gray-400 bg-[var(--bg-secondary)] border border-dashed border-gray-200  rounded-3xl flex flex-col items-center justify-center gap-3">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-50"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                <p>Belum ada proyek portofolio yang dipublikasikan.<br/><span className="text-sm">Silakan buat dan atur portofolio di Dashboard Admin.</span></p>
              </div>
            ) : (
              portfolios.slice(0, 3).map(port => (
                <div key={port.id} className="relative group bg-[var(--bg-secondary)] rounded-3xl overflow-hidden shadow-sm hover:shadow-xl dark:shadow-none dark:hover:shadow-sky-500/5 border border-gray-100  transition-all duration-300 hover:-translate-y-1 flex flex-col">
                  
                  {/* Image Header with Badge */}
                  <div className="w-full h-48 lg:h-56 overflow-hidden relative bg-slate-100 dark:bg-slate-800">
                    {port.image_url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={port.image_url} alt={port.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    )}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-teal-100/90 backdrop-blur-md text-teal-700 text-xs font-bold ring-1 ring-inset ring-teal-600/20 rounded-full shadow-sm">Completed</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex justify-between items-start gap-4 mb-3">
                      <h3 className="font-extrabold text-[#1f2937]  text-lg line-clamp-1">{port.title}</h3>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-300 dark:text-slate-600 shrink-0"><path d="M7 17l9.2-9.2M17 17V7H7"/></svg>
                    </div>
                    
                    <p className="text-slate-500 dark:text-gray-400 text-sm mb-6 line-clamp-3 leading-relaxed flex-1">
                      {port.description}
                    </p>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {port.tags && port.tags.map(tag => (
                        <span key={tag} className="px-2.5 py-1 bg-sky-50 dark:bg-sky-900/30 text-[#0ea5e9] dark:text-sky-300 border border-sky-100 dark:border-sky-800/50 rounded-full text-[11px] font-bold">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                      <a href={port.repo_url || '#'} className="flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-transparent border border-slate-200  text-slate-600 dark:text-gray-300 hover:text-[#0ea5e9] hover:border-[#0ea5e9] rounded-xl text-sm font-bold transition-colors">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                        Code
                      </a>
                      <a href={port.demo_url || '#'} className="flex items-center justify-center gap-2 px-4 py-2 bg-[#0ea5e9] hover:bg-[#0284c7] text-white rounded-xl text-sm font-bold transition-colors">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/></svg>
                        Demo
                      </a>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {portfolios.length > 3 && (
            <div className="flex justify-center">
              <a href="/portofolio" className="px-8 py-3 bg-[var(--bg-secondary)] border-2 border-[#0ea5e9] text-[#0ea5e9] rounded-xl font-bold hover:bg-[#0ea5e9] hover:text-white transition-colors duration-300 shadow-md shadow-sky-500/10">
                Lihat Semua Portofolio →
              </a>
            </div>
          )}
        </div>

        {/* ================= Hubungi Kami ================= */}
        <div id="contact" className="scroll-mt-24">
          <div className="bg-slate-800 dark:bg-[#1a1d24] rounded-3xl p-10 lg:p-14 text-center pb-12 pt-14 text-white relative overflow-hidden shadow-xl border border-gray-800">
            <h3 className="text-3xl font-extrabold mb-4 pb-2">Punya Ide Proyek Menarik?</h3>
            <p className="text-slate-300 mb-10 max-w-lg mx-auto leading-relaxed text-base">
              Saya secara terbuka menerima peluang freelance, kerjasama, obrolan bisnis, atau sekadar berdiskusi santai tentang teknologi teranyar.
            </p>
            <div className="flex flex-wrap justify-center gap-4 relative z-10">
              <a href="mailto:zakariamujur6@gmail.com" className="px-8 py-3.5 bg-white text-slate-800 font-bold rounded-2xl hover:bg-gray-100 transition-colors shadow-sm flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                Email Saya
              </a>
            </div>
          </div>
        </div>
      </article>

      <Footer />
    </main>
  );
}
