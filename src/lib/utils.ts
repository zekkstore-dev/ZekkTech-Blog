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
 */
export function getBaseUrl(): string {
  // 1. Kalo udah diset manual di ENV (bisa custom domain utama)
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  
  // 2. Kalo deploy di Netlify (bisa zekktech.netlify.app)
  if (process.env.URL) {
    return process.env.URL;
  }

  // 3. Fallback hardcore kalau di environment Production
  if (process.env.NODE_ENV === 'production') {
    return 'https://zekktech.biz.id';
  }

  // 4. Lingkungan Development lokal
  return 'http://localhost:3000';
}
