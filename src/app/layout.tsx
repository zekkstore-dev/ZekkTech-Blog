import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { GoogleAnalytics } from '@next/third-parties/google';
import ThemeProvider from '@/components/ThemeProvider';
import CopyProtection from '@/components/CopyProtection';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plus-jakarta',
  weight: ['400', '500', '600', '700', '800'],
});

import { getBaseUrl } from '@/lib/utils';

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: {
    default: 'ZekkTech | Blog Teknologi Indonesia',
    template: '%s | ZekkTech'
  },
  description: 'Blog teknologi Indonesia oleh Zakaria MP. Tips, trik, tutorial, dan berita teknologi terbaru.',
  keywords: ['blog', 'teknologi', 'indonesia', 'tutorial', 'tips', 'trik', 'javascript', 'css', 'react', 'nextjs', 'web development'],
  authors: [{ name: 'Zakaria MP' }],
  creator: 'Zakaria MP',
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: '/',
    siteName: 'ZekkTech Blog',
    title: 'ZekkTech | Blog Teknologi Indonesia',
    description: 'Blog teknologi Indonesia oleh Zakaria MP. Tips, trik, tutorial, dan berita teknologi terbaru.',
    images: [
      {
        url: '/images/LogoZekkTech.png',
        width: 1200,
        height: 630,
        alt: 'ZekkTech Blog Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ZekkTech | Blog Teknologi Indonesia',
    description: 'Blog teknologi Indonesia oleh Zakaria MP. Tips, trik, tutorial, dan berita teknologi terbaru.',
    images: ['/images/LogoZekkTech.png'],
    creator: '@zakariamp',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={plusJakartaSans.variable} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('zekktech_theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
        {/* JSON-LD Structured Data — WebSite schema untuk Google rich results */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "ZekkTech Blog",
              "url": "https://zekktech.biz.id",
              "description": "Blog teknologi Indonesia oleh Zakaria MP. Tips, trik, tutorial, dan berita teknologi terbaru.",
              "inLanguage": "id-ID",
              "author": {
                "@type": "Person",
                "name": "Zakaria MP",
                "url": "https://zekktech.biz.id/about",
                "sameAs": ["https://github.com/ZekkCode"]
              },
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": "https://zekktech.biz.id/blog?search={search_term_string}"
                },
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </head>
      <body className={`${plusJakartaSans.className} antialiased`}>
        <ThemeProvider>
          <CopyProtection />
          {children}
        </ThemeProvider>
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  );
}
