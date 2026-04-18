import Link from 'next/link';

interface SectionHeaderProps {
  title: string;
  linkText?: string;
  linkHref?: string;
}

export default function SectionHeader({ title, linkText = 'Semua Artikel', linkHref = '#' }: SectionHeaderProps) {
  return (
    <div className="section-header flex items-center justify-between mb-10">
      <div className="flex items-center gap-3">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{title}</h2>
        <div className="divider-line hidden sm:block w-8 h-[2px] bg-gray-300 rounded-full" />
      </div>
      {linkText && (
        <Link
          href={linkHref}
          className="flex items-center gap-1 text-[14px] sm:text-[15px] font-medium text-gray-600 hover:text-blue-500 transition-colors group"
        >
          {linkText}
          <svg
            width="6"
            height="12"
            viewBox="0 0 6 12"
            fill="none"
            className="transition-transform group-hover:translate-x-0.5"
          >
            <path d="M1 1L5 6L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      )}
    </div>
  );
}
