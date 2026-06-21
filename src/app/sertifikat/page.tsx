import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';
import SertifikatGrid from '@/components/SertifikatGrid';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Sertifikat | ZekkTech',
  description: 'Koleksi sertifikat dan pencapaian Zakaria MP di dunia teknologi.',
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

async function getCertificates(): Promise<Certificate[]> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl || supabaseUrl.includes('your-project')) return [];
    const { createServerSupabaseClient } = await import('@/lib/supabase/server');
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase
      .from('certificates')
      .select('*')
      .order('date', { ascending: false });
    return (data as Certificate[]) ?? [];
  } catch {
    return [];
  }
}

export default async function SertifikatPage() {
  const certs = await getCertificates();

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] transition-colors duration-300">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-12 md:py-20">
        <SertifikatGrid certificates={certs} maxItems={999} showViewAll={false} title="Semua Sertifikat" />
      </div>
      <Footer />
    </main>
  );
}

