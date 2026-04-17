import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export const metadata = {
  title: 'Tentang Saya | ZekkTech',
  description: 'Artikel dan halaman tentang profil kreator ZekkTech Blog.',
};

// konten fallback kalo supabase belum nyala atau datanya kosong
const fallbackContent = `Halo! Selamat datang di halaman profil kreator **ZekkTech Blog**. ZekkTech dibangun dengan kebahagiaan untuk menjadi sarana berbagi hal-hal menakjubkan bagi kalangan IT, baik Anda yang baru belajar maupun profesional yang ingin terus *up-to-date* dengan perkembangan dunia teknologi.

Tujuan blog ini diciptakan adalah untuk merangkai berbagai ragam konten, seperti:

- **Berita Teknologi:** Merangkum kabar dan tren perangkat lunak terbaru agar tidak tertinggal.
- **Tutorial Teknologi:** Pembelajaran praktik terbaik mengenai bahasa pemrograman dan tools kekinian.
- **Template:** Sumber daya open source, referensi, hingga template gratis yang dapat membantu mempercepat produktivitas.

Setiap karya tulis di sini diharapkan mampu memacu motivasi coding Anda dan tentunya mendatangkan wawasan segar setiap harinya. Silakan telusuri semua artikel yang ada dan apabila berkenan, support selalu dengan secangkir kopi!

Terima kasih dan *Happy Coding*! 💻🚀`;

// ambil konten tentang saya dari database
async function getAboutContent(): Promise<string> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    // kalo supabase belum dikonfigurasi, langsung pake fallback
    if (!supabaseUrl || supabaseUrl.includes('your-project')) {
      return fallbackContent;
    }

    const { createServerSupabaseClient } = await import('@/lib/supabase/server');
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'about_content')
      .single();

    // kalo error atau datanya kosong, fallback
    if (error || !data?.value) {
      return fallbackContent;
    }

    return data.value;
  } catch {
    // kalo ada masalah koneksi dll, ya pake fallback
    return fallbackContent;
  }
}

export default async function AboutPage() {
  const aboutContent = await getAboutContent();

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <article className="max-w-[720px] mx-auto px-6 py-10 sm:py-16">
        {/* judul halaman */}
        <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-gray-900 leading-tight mb-8 text-center">
          Tentang Kreator
        </h1>

        {/* ilustrasi profil */}
        <div className="w-full h-auto max-h-[400px] rounded-2xl overflow-hidden bg-gray-50 flex items-center justify-center p-8 mb-10 border border-gray-100">
          <Image
            src="/images/person-learn-coding.svg"
            alt="Profile Illustration"
            width={400}
            height={300}
            className="object-contain w-full h-[250px]"
          />
        </div>

        {/* konten utama dari database, dirender pake markdown */}
        <div className="prose prose-lg prose-gray max-w-none text-gray-700 leading-relaxed text-[16px] prose-headings:font-bold prose-a:text-blue-600 prose-strong:text-gray-900 prose-blockquote:border-blue-400">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {aboutContent}
          </ReactMarkdown>
        </div>
      </article>

      <Footer />
    </main>
  );
}
