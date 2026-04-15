import Image from 'next/image';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

interface ArticleCardProps {
  title: string;
  slug: string;
  coverUrl: string | null;
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
  authorName,
  createdAt,
  readingTime,
  similarityScore,
  highlightWords = [],
}: ArticleCardProps) {
  // Fungsi Helper Untuk Men-Highlight Teks via Information Retrieval Token Matches
  const renderHighlightedText = (text: string, wordsToHighlight: string[]) => {
    if (!wordsToHighlight || wordsToHighlight.length === 0) return text;
    
    // Sort words by length descending so longer words match first against partial overlaps
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
  return (
    <Link href={`/post/${slug}`} className="group block">
      <article className="relative bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/60 hover:-translate-y-1">
        {/* Lencana Similarity (IR) */}
        {similarityScore !== undefined && similarityScore > 0 && (
          <div className="absolute top-3 right-3 z-20 bg-green-500/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1 bg-opacity-90 rounded-full shadow-lg flex items-center gap-1">
            <span>🔥</span>
            Akurasi {similarityScore}%
          </div>
        )}
        
        {/* Thumbnail */}
        <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-100">
          {coverUrl ? (
            <Image
              src={coverUrl}
              alt={title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="text-blue-300">
                <path d="M4 16L8.586 11.414C9.367 10.633 10.633 10.633 11.414 11.414L16 16M14 14L15.586 12.414C16.367 11.633 17.633 11.633 18.414 12.414L20 14M14 8H14.01M6 20H18C19.105 20 20 19.105 20 18V6C20 4.895 19.105 4 18 4H6C4.895 4 5 4.895 5 6V18C5 19.105 4.895 20 6 20Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5">
          <h3 className="text-[15px] sm:text-[16px] font-bold text-gray-900 leading-snug line-clamp-2 mb-4 group-hover:text-blue-600 transition-colors">
            {renderHighlightedText(title, highlightWords)}
          </h3>

          {/* Author meta */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-[12px] font-bold shrink-0">
              {authorName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-gray-800 truncate">{authorName}</p>
              <p className="text-[12px] text-gray-400">
                {formatDate(createdAt)} • {readingTime} Menit Dibaca
              </p>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
