'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';

/**
 * Rate limiter berbasis Supabase.
 * Di serverless (Netlify), Map in-memory tidak persistent antar request —
 * jadi kita harus pakai database untuk menyimpan percobaan login.
 * 
 * Menggunakan tabel `login_attempts` di Supabase untuk tracking.
 * Fallback: kalau tabel belum ada, skip rate limit (tetap login).
 */
const MAX_ATTEMPTS = 5;
const WINDOW_MINUTES = 15;

async function checkRateLimit(email: string): Promise<boolean> {
  try {
    const supabase = await createServerSupabaseClient();
    const windowStart = new Date(Date.now() - WINDOW_MINUTES * 60 * 1000).toISOString();

    const { count, error } = await supabase
      .from('login_attempts')
      .select('*', { count: 'exact', head: true })
      .eq('email', email.toLowerCase())
      .gte('attempted_at', windowStart);

    // Kalo tabel belum ada atau error, skip rate limit — jangan block user
    if (error) {
      console.warn('[Rate Limit] Tabel login_attempts belum ada, skip rate limiting:', error.message);
      return true;
    }

    return (count || 0) < MAX_ATTEMPTS;
  } catch {
    // Fallback: kalau gagal cek, tetap izinkan login
    return true;
  }
}

async function recordLoginAttempt(email: string): Promise<void> {
  try {
    const supabase = await createServerSupabaseClient();
    await supabase
      .from('login_attempts')
      .insert([{ email: email.toLowerCase() }]);
  } catch {
    // Kalo gagal record, lanjut aja — jangan block flow login
  }
}

async function clearLoginAttempts(email: string): Promise<void> {
  try {
    const supabase = await createServerSupabaseClient();
    await supabase
      .from('login_attempts')
      .delete()
      .eq('email', email.toLowerCase());
  } catch {
    // Kalo gagal hapus, lanjut aja
  }
}

export type LoginState = {
  error?: string;
  success?: boolean;
};

export async function loginAction(prevState: LoginState, formData: FormData): Promise<LoginState> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email dan password wajib diisi' };
  }

  // cek jatah login dari database
  const isAllowed = await checkRateLimit(email);
  if (!isAllowed) {
    return { error: 'Terlalu banyak percobaan. Silakan coba lagi dalam 15 menit.' };
  }

  // catat percobaan login sebelum validasi
  await recordLoginAttempt(email);

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  // hapus record percobaan kl dia sukses masuk
  await clearLoginAttempts(email);

  return { success: true };
}
