import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plus-jakarta',
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'ZekkTech | Blog Teknologi Indonesia',
  description: 'Blog teknologi Indonesia oleh Zakaria MP. Tips, trik, tutorial, dan berita teknologi terbaru.',
  keywords: ['blog', 'teknologi', 'indonesia', 'tutorial', 'tips', 'trik', 'javascript', 'css', 'react'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={plusJakartaSans.variable}>
      <body className={`${plusJakartaSans.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
