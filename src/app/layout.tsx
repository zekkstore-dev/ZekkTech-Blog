import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { GoogleAnalytics } from '@next/third-parties/google';
import ThemeProvider from '@/components/ThemeProvider';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plus-jakarta',
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NODE_ENV === 'production' ? 'https://zekktech.com' : 'http://localhost:3000'),
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
        url: '/images/ZekkTech.png',
        width: 1200,
        height: 630,
        alt: 'ZekkTech Blog Banner',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ZekkTech | Blog Teknologi Indonesia',
    description: 'Blog teknologi Indonesia oleh Zakaria MP. Tips, trik, tutorial, dan berita teknologi terbaru.',
    images: ['/images/ZekkTech.png'],
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
      </head>
      <body className={`${plusJakartaSans.className} antialiased`}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  );
}
