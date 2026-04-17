import Image from 'next/image';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

interface ArticleCardProps {
  title: string;
  slug: string;
  coverUrl: string | null;
  excerpt: string | null;
  category: string;
  authorName: string;
  createdAt: string;
  readingTime: number;
  similarityScore?: number;
  highlightWords?: string[];
}

export default function ArticleCard({
  title,
  slug,
  coverUrl,
  excerpt,
  category,
  authorName,
  createdAt,
  readingTime,
  similarityScore,
  highlightWords = [],
}: ArticleCardProps) {
  // fungsi buat nge-highlight kata yang match dari hasil pencarian
  const renderHighlightedText = (text: string, wordsToHighlight: string[]) => {
    if (!wordsToHighlight || wordsToHighlight.length === 0) return text;

    // urutkan kata dari yang terpanjang dulu biar ga overlap pas di-regex
    const safeWords = wordsToHighlight
      .filter((w) => w.trim().length > 0)
      .sort((a, b) => b.length - a.length)
      .map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

    if (safeWords.length === 0) return text;

    const regex = new RegExp(`(${safeWords.join('|')})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-yellow-200 text-gray-900 rounded-sm px-0.5 font-bold">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  // ambil kategori pertama aja buat ditampilin di pill
  const primaryCategory = category.split(',')[0].trim();

  return (
    <Link href={`/post/${slug}`} className="group block">
      <article className="relative bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/60 hover:-translate-y-1">
        {/* lencana akurasi cuma muncul pas lagi nyari aja */}
        {similarityScore !== undefined && similarityScore > 0 && (
          <div className="absolute top-3 right-3 z-20 bg-blue-500/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
            <span>🎯</span>
            Relevansi {similarityScore}%
          </div>
        )}

        {/* thumbnail gambar */}
        <div className="relative w-full aspect-video overflow-hidden bg-gray-50">
          {coverUrl ? (
            <Image
              src={coverUrl}
              alt={title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-50 via-indigo-50 to-sky-50 flex items-center justify-center">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="text-blue-200">
                <path d="M4 16L8.586 11.414C9.367 10.633 10.633 10.633 11.414 11.414L16 16M14 14L15.586 12.414C16.367 11.633 17.633 11.633 18.414 12.414L20 14M14 8H14.01M6 20H18C19.105 20 20 19.105 20 18V6C20 4.895 19.105 4 18 4H6C4.895 4 5 4.895 5 6V18C5 19.105 4.895 20 6 20Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          )}
        </div>

        {/* konten card */}
        <div className="p-4 sm:p-5">
          {/* baris atas: kategori + tanggal */}
          <div className="flex items-center justify-between mb-3">
            <span className="inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-600 border border-blue-100">
              {primaryCategory}
            </span>
            <span className="text-[11px] text-gray-400 font-medium">
              {formatDate(createdAt)}
            </span>
          </div>

          {/* judul artikel */}
          <h3 className="text-[15px] sm:text-base font-bold text-gray-900 leading-snug line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
            {renderHighlightedText(title, highlightWords)}
          </h3>

          {/* kutipan singkat / excerpt */}
          {excerpt && (
            <p className="text-[13px] text-gray-500 leading-relaxed line-clamp-2 mb-4">
              {excerpt}
            </p>
          )}

          {/* footer: avatar penulis + baca selengkapnya */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-50">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                {authorName.charAt(0).toUpperCase()}
              </div>
              <span className="text-[12px] font-medium text-gray-600">{authorName}</span>
            </div>
            <span className="text-[12px] font-semibold text-blue-500 group-hover:text-blue-600 transition-colors flex items-center gap-1">
              Baca
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-0.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
