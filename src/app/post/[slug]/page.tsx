import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CommentSection from '@/components/CommentSection';
import ShareBox from '@/components/ShareBox';
import { seedPosts } from '@/lib/seed-data';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import NewsletterSection from '@/components/NewsletterSection';
import ViewTracker from '@/components/ViewTracker';
import PostViews from '@/components/PostViews';
import LiveClock from '@/components/LiveClock';
import type { Post } from '@/types/post';
import type { Metadata } from 'next';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// tarik data post berdasarkan slug dari supabase, kalo gagal pake fallback seed
async function getPost(slug: string): Promise<Post | null> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    // kalo supabase belum diatur, pake data dummy
    if (!supabaseUrl || supabaseUrl.includes('your-project')) {
      return seedPosts.find((p) => p.slug === slug) || null;
    }
    const { createServerSupabaseClient } = await import('@/lib/supabase/server');
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase
      .from('posts')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single();
    return data || seedPosts.find((p) => p.slug === slug) || null;
  } catch {
    return seedPosts.find((p) => p.slug === slug) || null;
  }
}

// generate metadata SEO dari data post
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  
  if (!post) {
    return { title: 'Artikel tidak ditemukan | ZekkTech' };
  }

  const defaultImage = '/images/ZekkTech.png';
  const ogImage = post.cover_url || defaultImage;
  const description = post.excerpt || post.title;
  const { getBaseUrl } = await import('@/lib/utils');
  const url = `${getBaseUrl()}/post/${post.slug}`;

  return {
    title: post.title,
    description: description,
    openGraph: {
      title: post.title,
      description: description,
      url: url,
      type: 'article',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: description,
      images: [ogImage],
    },
  };
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPost(slug);

  // kalo artikelnya ga ketemu, lempar ke 404
  if (!post) notFound();

  // pecah kategori biar bisa ditampilin satu-satu
  const categories = post.category.split(',').map(c => c.trim());

  // ambil foto profil, job, dan bio dari site_settings (untuk ditampilkan di header + sidebar)
  let authorAvatar: string | null = null;
  let authorJob = 'Web Developer';
  let authorBio = 'Penulis aktif di ZekkTech Blog, berbagi tips dan trik dunia pemrograman.';
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (supabaseUrl && !supabaseUrl.includes('your-project')) {
      const { createServerSupabaseClient } = await import('@/lib/supabase/server');
      const supabase = await createServerSupabaseClient();
      const { data: settings } = await supabase
        .from('site_settings')
        .select('key, value')
        .in('key', ['profile_avatar', 'profile_job', 'profile_bio']);
      if (settings) {
        settings.forEach(s => {
          if (s.key === 'profile_avatar' && s.value) authorAvatar = s.value;
          if (s.key === 'profile_job' && s.value) authorJob = s.value;
          if (s.key === 'profile_bio' && s.value) authorBio = s.value;
        });
      }
    }
  } catch { /* pakai fallback default */ }

  return (
    <main className="post-page min-h-screen bg-[var(--bg-primary)] transition-colors duration-300">
      <Navbar />

      {/* hero area: cover image sebagai background dengan overlay */}
      {post.cover_url ? (
        <div className="post-hero relative w-full overflow-hidden border-b border-gray-100">
          {/* gambar cover sebagai background */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.cover_url}
            alt={post.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* overlay gradasi hitam transparan dari bawah ke atas */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />

          {/* konten teks di atas gambar */}
          <div className="relative max-w-5xl mx-auto px-6 py-16 sm:py-20 flex flex-col justify-end min-h-[380px] sm:min-h-[420px]">
            {/* pill kategori — biru */}
            <div className="mb-4 flex flex-wrap gap-2">
              {categories.map(cat => (
                <Link
                  key={cat}
                  href={`/blog?search=${encodeURIComponent(cat)}`}
                  className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/80 backdrop-blur-sm text-white border border-blue-400/60 hover:bg-blue-600/90 transition-colors"
                >
                  #{cat}
                </Link>
              ))}
            </div>

            {/* judul artikel */}
            <h1 className="text-2xl sm:text-3xl lg:text-[38px] font-extrabold text-white leading-tight mb-5 drop-shadow-md">
              {post.title}
            </h1>

            {/* info penulis + views */}
            <div className="flex items-center gap-3">
              {/* foto profil atau inisial */}
              {authorAvatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={authorAvatar} alt={post.author_name} className="w-10 h-10 rounded-full object-cover border-2 border-white/50 shrink-0" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                  {post.author_name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">{post.author_name}</p>
                <p className="text-xs text-white/70 flex items-center gap-1.5">
                  {formatDate(post.created_at)} • {post.reading_time} Menit Dibaca
                  <PostViews postId={post.id} initialViews={post.views} />
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* fallback tanpa cover — tampilan biasa */
        <div className="post-hero bg-white border-b border-gray-100 transition-colors duration-300">
          <div className="max-w-5xl mx-auto px-6 py-10 sm:py-14">
            <div className="mb-4 flex flex-wrap gap-2">
              {categories.map(cat => (
                <Link
                  key={cat}
                  href={`/blog?search=${encodeURIComponent(cat)}`}
                  className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100 transition-colors"
                >
                  #{cat}
                </Link>
              ))}
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-[38px] font-extrabold text-gray-900 leading-tight mb-6">
              {post.title}
            </h1>
            <div className="flex items-center gap-4">
              {/* foto profil atau inisial */}
              {authorAvatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={authorAvatar} alt={post.author_name} className="w-11 h-11 rounded-full object-cover border-2 border-blue-100 shrink-0" />
              ) : (
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                  {post.author_name.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <p className="author-name text-sm font-semibold text-gray-800">{post.author_name}</p>
                <p className="author-meta text-xs text-gray-400 flex items-center gap-1.5">
                  {formatDate(post.created_at)} • {post.reading_time} Menit Dibaca
                  <PostViews postId={post.id} initialViews={post.views} />
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* layout utama: konten kiri + sidebar kanan sticky */}
      <div className="max-w-5xl mx-auto px-6 py-8 sm:py-12">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* konten utama artikel — di kiri */}
          <article className="flex-1 min-w-0 order-1">
            {/* isi artikel dari markdown */}
            <div className="post-content-card bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 lg:p-10 shadow-sm mb-8 transition-colors duration-300">
              <div className="prose prose-lg prose-gray max-w-none prose-headings:font-bold prose-a:text-blue-600 hover:prose-a:text-blue-500 prose-img:rounded-xl prose-blockquote:border-blue-400 prose-blockquote:bg-blue-50/50 prose-blockquote:rounded-r-xl prose-blockquote:py-1 overflow-x-hidden">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    ol: ({ node, ...props }) => (
                      <ol {...props} style={{ listStyleType: 'decimal', paddingLeft: '1.75rem', margin: '0.75rem 0', ...(props.style as React.CSSProperties) }} />
                    ),
                    ul: ({ node, ...props }) => (
                      <ul {...props} style={{ listStyleType: 'disc', paddingLeft: '1.75rem', margin: '0.75rem 0', ...(props.style as React.CSSProperties) }} />
                    ),
                    li: ({ node, ...props }) => (
                      <li {...props} style={{ marginBottom: '0.3rem', ...(props.style as React.CSSProperties) }} />
                    ),
                    hr: ({ node, ...props }) => (
                      <hr {...props} style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '1.25rem 0', ...(props.style as React.CSSProperties) }} />
                    ),
                    // eslint-disable-next-line @next/next/no-img-element
                    img: ({ node, src, alt, ...props }) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={src}
                        alt={alt || ''}
                        {...props}
                        style={{ maxWidth: '100%', borderRadius: '10px', margin: '12px 0', display: 'block', ...(props.style as React.CSSProperties) }}
                        loading="lazy"
                      />
                    ),
                  }}
                >
                  {post.content}
                </ReactMarkdown>
              </div>
            </div>

            {/* seksi komentar */}
            <div className="comment-section-wrapper bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm transition-colors duration-300">
              <CommentSection postId={post.id} />
            </div>
          </article>

          {/* sidebar kanan — sticky pas scroll di desktop */}
          <aside className="w-full lg:w-[260px] shrink-0 order-2">
            <div className="lg:sticky lg:top-24 space-y-5">
              {/* box profil penulis */}
              <div className="sidebar-card bg-white rounded-2xl border border-gray-100 p-5 shadow-sm text-center transition-colors duration-300">
                {/* foto profil atau inisial */}
                {authorAvatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={authorAvatar}
                    alt={post.author_name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-blue-100 mx-auto mb-3"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white text-xl font-bold mx-auto mb-3">
                    {post.author_name.charAt(0).toUpperCase()}
                  </div>
                )}
                <h4 className="text-sm font-bold text-gray-900">{post.author_name}</h4>
                <p className="text-xs text-gray-400 mb-3">{authorJob}</p>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {authorBio}
                </p>
              </div>

              {/* box tags / kategori */}
              <div className="sidebar-card bg-white rounded-2xl border border-gray-100 p-5 shadow-sm transition-colors duration-300">
                <h4 className="text-sm font-bold text-gray-900 mb-3">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {categories.map(cat => (
                    <Link
                      key={cat}
                      href={`/blog?search=${encodeURIComponent(cat)}`}
                      className="tag-pill inline-flex px-2.5 py-1 rounded-lg text-[11px] font-medium bg-gray-50 text-gray-600 border border-gray-100 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100 transition-colors"
                    >
                      #{cat}
                    </Link>
                  ))}
                </div>
              </div>

              {/* box jam realtime buat user */}
              <div className="sidebar-card bg-white rounded-2xl border border-gray-100 p-5 shadow-sm transition-colors duration-300">
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Waktu Sekarang</h4>
                <div className="flex flex-col items-center py-3">
                  <div className="text-2xl font-bold text-gray-900 tracking-tight">
                    <LiveClock variant="full" />
                  </div>
                  <p className="text-[11px] text-gray-400 mt-2">Waktu Lokal Anda</p>
                </div>
              </div>

              {/* box bagikan artikel */}
              <ShareBox title={post.title} slug={post.slug} />
            </div>
          </aside>
        </div>
      </div>

      {/* tracker view tersembunyi buat analitik */}
      <ViewTracker postId={post.id} />

      {/* newsletter CTA */}
      <NewsletterSection />

      <Footer />
    </main>
  );
}
