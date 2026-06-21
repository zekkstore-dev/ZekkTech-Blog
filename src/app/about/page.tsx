import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Portfolio } from '@/types/portfolio';
import FloatingIcons from '@/components/FloatingIcons';
import PortofolioGrid from '@/components/PortofolioGrid';
import SertifikatGrid from '@/components/SertifikatGrid';
import ExperienceTimeline from '@/components/ExperienceTimeline';
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Tentang Saya | ZekkTech',
  description: 'Kenalan dengan Zakaria MP, Full-Stack Developer dan kreator ZekkTech Blog. Berbagi tips teknologi, tutorial web, dan pengalaman di dunia programming.',
  openGraph: {
    title: 'Tentang Saya | ZekkTech',
    description: 'Kenalan dengan Zakaria MP, Full-Stack Developer dan kreator ZekkTech Blog. Berbagi tips teknologi, tutorial web, dan pengalaman di dunia programming.',
  },
};

const fallbackContent = `Halo! Selamat datang di halaman profil kreator **ZekkTech Blog**.

Saya adalah seorang **Full-Stack Developer** yang gemar berbagi ilmu seputar teknologi, web development, dan tips programming. Di blog ini saya menulis tutorial, tips & trik, serta pengalaman nyata dalam dunia coding.`;

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

  interface Certificate {
    id: string;
    title: string;
    issuer: string;
    date: string;
    image_url: string;
    cert_url: string;
    section: string;
  }

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

  const data = { profile: defaultProfile, portfolios: [] as Portfolio[], certificates: [] as Certificate[], experiences: [] as Experience[] };

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

    // Fetch Certificates
    const { data: certs } = await supabase.from('certificates').select('*').order('date', { ascending: false });
    if (certs) {
      data.certificates = certs as Certificate[];
    }

    // Fetch Experiences
    const { data: exps } = await supabase.from('experiences').select('*').order('start_date', { ascending: false });
    if (exps) {
      data.experiences = exps as Experience[];
    }
  } catch (err) {
    console.error(err);
  }

  return data;
}

export default async function AboutPage() {
  const { profile, portfolios, certificates, experiences } = await getPageData();

  return (
    <main className="about-page min-h-screen bg-[var(--bg-primary)] transition-colors duration-300 relative">
      <FloatingIcons />
      <Navbar />

      <article className="max-w-[900px] mx-auto px-4 sm:px-6 py-8 md:py-20 animate-fade-in-up relative z-[1]">
        
        {/* ================= Profil Section ================= */}
        <div id="profil" className="mb-12 md:mb-20 scroll-mt-24">
          <div className="flex flex-col md:flex-row gap-5 md:gap-8 items-start">
            {/* Left Column: Avatar & Download CTA */}
            <div className="w-full md:w-64 flex flex-col items-center shrink-0">
              <div className="w-32 h-32 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-2xl overflow-hidden border-4 sm:border-[6px] border-white dark:border-[#1a1d24] shadow-xl relative mb-4 sm:mb-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-800 dark:text-white mb-1">{profile.name}</h1>
              <p className="text-slate-500 dark:text-gray-400 font-medium mb-4 sm:mb-6 text-xs sm:text-sm">{profile.job}</p>
              
              <a
                href={profile.cv_url || '#'}
                target={profile.cv_url ? '_blank' : undefined}
                rel="noopener noreferrer"
                className={`w-full flex items-center justify-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base font-bold rounded-xl shadow-lg transition-all ${profile.cv_url ? "bg-[#0ea5e9] hover:bg-[#0284c7] text-white shadow-sky-500/30 hover:-translate-y-0.5" : "bg-gray-200 dark:bg-gray-800 text-gray-500 cursor-not-allowed shadow-none"}`}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                {profile.cv_url ? "Download CV" : "CV Belum Diunggah"}
              </a>
            </div>

            {/* Right Column: Hello, Bio & Buttons */}
            <div className="flex-1 w-full bg-[var(--bg-secondary)] rounded-xl p-5 sm:p-8 shadow-sm border border-gray-100 /50">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white mb-3 sm:mb-4 flex items-center gap-2">
                Hello! <span>👋</span>
              </h2>
              <p className="text-slate-600 dark:text-gray-300 leading-relaxed mb-4 sm:mb-6 text-[13px] sm:text-[15px]">
                {profile.bio}
              </p>
              
              {/* Utility Buttons (Resume/Cert/Portfolio/Experience) */}
              <div className="flex flex-wrap gap-2 sm:gap-3 mb-5 sm:mb-8 pb-5 sm:pb-8 border-b border-gray-100 ">
                {/* My Sertificate — selalu bisa diklik, mengarah ke halaman /sertifikat */}
                <a
                  href="/sertifikat"
                  className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 border border-slate-200 bg-white dark:bg-[#252830] text-slate-700 dark:text-gray-300 hover:border-[#0ea5e9] hover:text-[#0ea5e9] rounded-lg font-medium text-xs sm:text-sm transition-all shadow-sm"
                >
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  My Sertificate
                </a>
                {/* My Resume — langsung buka URL PDF */}
                <a
                  href={profile.cv_url || '#'}
                  target={profile.cv_url ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 border rounded-lg font-medium text-xs sm:text-sm transition-all shadow-sm ${profile.cv_url ? "border-slate-200 bg-white dark:bg-[#252830] text-slate-700 dark:text-gray-300 hover:border-[#0ea5e9] hover:text-[#0ea5e9]" : "border-dashed border-gray-200 text-gray-400 bg-transparent cursor-not-allowed"}`}
                >
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                  My Resume
                </a>
                {/* My Portfolio */}
                <a
                  href="#portofolio"
                  className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 border border-slate-200 bg-white dark:bg-[#252830] text-slate-700 dark:text-gray-300 hover:border-[#0ea5e9] hover:text-[#0ea5e9] rounded-lg font-medium text-xs sm:text-sm transition-all shadow-sm"
                >
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                  My Portfolio
                </a>
                {/* My Experience */}
                <a
                  href="/resume"
                  className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 border border-slate-200 bg-white dark:bg-[#252830] text-slate-700 dark:text-gray-300 hover:border-[#0ea5e9] hover:text-[#0ea5e9] rounded-lg font-medium text-xs sm:text-sm transition-all shadow-sm"
                >
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                  My Experience
                </a>
              </div>

              {/* Tech Stack Horizontal List */}
              <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-white mb-3 sm:mb-4">Tech Stack</h3>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {profile.techs.map((tech) => (
                  <span key={tech} className="px-3 py-1.5 sm:px-4 sm:py-2 bg-slate-50 dark:bg-[#252830] border border-slate-200  text-slate-700 dark:text-gray-300 text-[11px] sm:text-xs font-bold rounded-lg shadow-sm">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ================= Markdown Story ================= */}
        {profile.markdown && (
          <div className="mb-12 md:mb-20 bg-[var(--bg-secondary)] p-5 sm:p-8 rounded-xl shadow-sm border border-gray-100 /50">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Tentang Perjalanan Saya</h2>
            <div className="prose prose-slate max-w-none text-[15px] leading-relaxed text-slate-600 dark:text-gray-300 [&>p]:text-slate-600 dark:[&>p]:text-gray-300 [&>ul]:text-slate-600 dark:[&>ul]:text-gray-300 [&>ol]:text-slate-600 dark:[&>ol]:text-gray-300 [&_strong]:text-slate-800 dark:[&_strong]:text-gray-100 [&_h2]:text-slate-800 dark:[&_h2]:text-gray-100 [&_h2]:mt-10 [&_h2]:mb-4 [&_h3]:text-slate-800 dark:[&_h3]:text-gray-100 [&_h3]:mt-6 [&_h3]:mb-3 [&_p]:mb-4 [&_br]:block [&_br]:mb-2">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {profile.markdown}
              </ReactMarkdown>
            </div>
          </div>
        )}

        {/* ================= Experience Section ================= */}
        {experiences.length > 0 && (
          <div id="experience" className="mb-12 md:mb-20 scroll-mt-24">
            <ExperienceTimeline experiences={experiences} title="Experience" />
          </div>
        )}

        {/* ================= Portofolio Section ================= */}
        <div id="portofolio" className="mb-12 md:mb-20 scroll-mt-24">
          <PortofolioGrid portfolios={portfolios} maxItems={8} />
        </div>

        {/* ================= Sertifikat Section ================= */}
        <div id="sertifikat" className="mb-12 md:mb-20 scroll-mt-24">
          <SertifikatGrid certificates={certificates} maxItems={8} title="Sertifikat Terbaru" />
        </div>

        {/* ================= Hubungi Kami ================= */}
        <div id="contact" className="scroll-mt-24">
          <div className="bg-slate-800 dark:bg-[#1a1d24] rounded-xl p-6 sm:p-10 lg:p-14 text-center pb-8 sm:pb-12 pt-10 sm:pt-14 text-white relative overflow-hidden shadow-xl border border-gray-800">
            <h3 className="text-2xl sm:text-3xl font-extrabold mb-3 sm:mb-4 pb-2">Punya Ide Proyek Menarik?</h3>
            <p className="text-slate-300 mb-6 sm:mb-10 max-w-lg mx-auto leading-relaxed text-sm sm:text-base">
              Saya secara terbuka menerima peluang freelance, kerjasama, obrolan bisnis, atau sekadar berdiskusi santai tentang teknologi teranyar.
            </p>
            <div className="flex flex-row justify-center gap-2 sm:gap-4 relative z-10">
              <a href="mailto:zakariamujur6@gmail.com" className="px-3.5 py-2 sm:px-6 sm:py-3 md:px-8 md:py-3.5 bg-white text-slate-800 font-bold rounded-xl sm:rounded-2xl hover:bg-gray-100 transition-colors shadow-sm flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm md:text-base">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                Email Saya
              </a>
              {/* Tombol WhatsApp langsung ke nomor pribadi */}
              <a
                href="https://wa.me/62881081772005"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 sm:px-6 sm:py-3 md:px-8 md:py-3.5 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-xl sm:rounded-2xl transition-colors shadow-sm flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm md:text-base"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </article>

      <Footer />
    </main>
  );
}
