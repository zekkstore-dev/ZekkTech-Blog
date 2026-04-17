import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { checkR2Connection } from '@/lib/r2/client';

/**
 * GET /api/health
 * Cek status koneksi Supabase & Cloudflare R2 sekaligus.
 * Hanya bisa diakses Admin (sesi aktif).
 */
export async function GET() {
  const results = {
    timestamp: new Date().toISOString(),
    supabase: { connected: false, url: '', error: '' },
    r2: { connected: false, bucket: '', error: '' },
  };

  // --- Cek Supabase ---
  try {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.from('posts').select('id').limit(1);
    results.supabase = {
      connected: !error,
      url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      error: error?.message || '',
    };
  } catch (err: unknown) {
    results.supabase.error = err instanceof Error ? err.message : 'Unknown';
  }

  // --- Cek Cloudflare R2 ---
  try {
    const r2Status = await checkR2Connection();
    results.r2 = {
      connected: r2Status.connected,
      bucket: r2Status.bucketName,
      error: r2Status.error || '',
    };
  } catch (err: unknown) {
    results.r2.error = err instanceof Error ? err.message : 'Unknown';
  }

  const allOk = results.supabase.connected && results.r2.connected;
  return NextResponse.json(results, { status: allOk ? 200 : 500 });
}
