'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';

// bikin limitasi login per ip/email sederhana aja di ram biar ga kena bruteforce
const rateLimitMap = new Map<string, { count: number; expiresAt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  // bersihin data limit yang udah expired biar ram server ga bengkak
  if (rateLimitMap.size > 1000) {
    rateLimitMap.forEach((val, key) => {
      if (val.expiresAt < now) rateLimitMap.delete(key);
    });
  }

  if (!record) {
    rateLimitMap.set(identifier, { count: 1, expiresAt: now + WINDOW_MS });
    return true;
  }

  if (record.expiresAt < now) {
    rateLimitMap.set(identifier, { count: 1, expiresAt: now + WINDOW_MS });
    return true;
  }

  if (record.count >= MAX_ATTEMPTS) {
    return false;
  }

  record.count += 1;
  return true;
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

  // cek jatah login
  const isAllowed = checkRateLimit(email.toLowerCase());
  if (!isAllowed) {
    return { error: 'Terlalu banyak percobaan. Silakan coba lagi dalam 15 menit.' };
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  // hapus blacklist jatah kl dia sukses masuk
  rateLimitMap.delete(email.toLowerCase());

  return { success: true };
}
