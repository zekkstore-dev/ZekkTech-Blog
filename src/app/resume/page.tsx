import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Define the shape of searchParams, we are receiving them from Next.js Page Props
export const metadata = {
  title: 'Dokumen | ZekkTech',
  description: 'Melihat Curriculum Vitae dan Sertifikat',
};

async function getDocumentUrls() {
  let cvUrl = '';
  let certUrl = '';

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (supabaseUrl && !supabaseUrl.includes('your-project')) {
      const { createServerSupabaseClient } = await import('@/lib/supabase/server');
      const supabase = await createServerSupabaseClient();
      const { data } = await supabase.from('site_settings').select('key, value').in('key', ['profile_cv', 'profile_cert']);
      if (data) {
        data.forEach(s => {
          if (s.key === 'profile_cv') cvUrl = s.value;
          if (s.key === 'profile_cert') certUrl = s.value;
        });
      }
    }
  } catch (error) {
    console.error('Error fetching document URLs', error);
  }

  return { cvUrl, certUrl };
}

export default async function ResumePage({
  searchParams,
}: {
  searchParams: { doc?: string }
}) {
  const { cvUrl, certUrl } = await getDocumentUrls();
  const activeTab = searchParams.doc === 'cert' ? 'cert' : 'cv';

  const currentUrl = activeTab === 'cv' ? cvUrl : certUrl;
  
  return (
    <main className="min-h-screen flex flex-col bg-[var(--bg-primary)] transition-colors duration-300">
      <Navbar />

      <div className="flex-1 max-w-[1000px] mx-auto w-full px-6 py-12 md:py-16">
        <div className="mb-8 md:mb-12 text-center">
          <h1 className="text-3xl font-extrabold text-slate-800  mb-3">Dokumen Profesional</h1>
          <p className="text-slate-500 dark:text-gray-400">Pratinjau lengkap Curriculum Vitae dan Sertifikat unggulan.</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <a href="/resume?doc=cv" className={`px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'cv' ? 'bg-[#0ea5e9] text-white shadow-lg shadow-sky-500/30' : 'bg-[var(--bg-secondary)] text-slate-600 dark:text-gray-300 border border-gray-200  hover:border-[#0ea5e9]'}`}>
            Curriculum Vitae
          </a>
          <a href="/resume?doc=cert" className={`px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'cert' ? 'bg-[#0ea5e9] text-white shadow-lg shadow-sky-500/30' : 'bg-[var(--bg-secondary)] text-slate-600 dark:text-gray-300 border border-gray-200  hover:border-[#0ea5e9]'}`}>
            Sertifikat Utama
          </a>
        </div>

        {/* Warning if no document uploaded */}
        {!currentUrl && (
          <div className="w-full py-20 text-center bg-[var(--bg-secondary)] rounded-3xl border border-dashed border-gray-300 ">
            <p className="text-slate-500 dark:text-gray-400 font-medium">Dokumen ini belum diunggah.</p>
          </div>
        )}

        {/* PDF Viewer Canvas */}
        {currentUrl && (
          <div className="w-full h-[600px] md:h-[800px] bg-[var(--bg-secondary)] rounded-3xl overflow-hidden shadow-xl border border-gray-100 /50 relative">
            {/* Download explicitly fallback */}
            <div className="absolute top-4 right-4 z-10">
              <a href={currentUrl} download target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-slate-800/80 backdrop-blur text-white text-xs font-bold rounded-lg hover:bg-slate-900 transition flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Download File Asli
              </a>
            </div>
            
            <iframe 
              src={`${currentUrl}#toolbar=0`} 
              title={activeTab === 'cv' ? 'Resume' : 'Sertifikat'}
              className="w-full h-full border-none"
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
