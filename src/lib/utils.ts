/**
 * Generate a URL-friendly slug from a title string.
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Estimate reading time for a given text content.
 * Assumes average reading speed of 200 words per minute.
 */
export function estimateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return Math.max(1, minutes);
}

/**
 * Format a date string to Indonesian locale display.
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Truncate text to a maximum length with ellipsis.
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '...';
}

/**
 * Dapatkan Base URL secara cerdas (Netlify, Vercel, Custom Domain, atau Localhost)
 * Selalu mengembalikan URL valid dengan protokol https:// atau http://
 */
export function getBaseUrl(): string {
  // Helper: pastikan URL punya protokol
  const ensureProtocol = (url: string): string => {
    const trimmed = url.trim();
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      return trimmed;
    }
    return `https://${trimmed}`;
  };

  // 1. Kalo udah diset manual di ENV (custom domain utama)
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return ensureProtocol(process.env.NEXT_PUBLIC_SITE_URL);
  }

  // 2. Kalo deploy di Netlify — injected otomatis oleh Netlify
  if (process.env.URL) {
    return ensureProtocol(process.env.URL);
  }

  // 3. Fallback production
  if (process.env.NODE_ENV === 'production') {
    return 'https://zekktech.biz.id';
  }

  // 4. Development lokal
  return 'http://localhost:3000';
}
