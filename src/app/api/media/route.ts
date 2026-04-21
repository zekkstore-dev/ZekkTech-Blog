import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { listR2Files, deleteFromR2 } from '@/lib/r2/storage';

/**
 * Middleware cek autentikasi admin
 * Digunakan di setiap handler agar tidak bisa diakses user biasa
 */
async function requireAdmin() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');
}

/**
 * GET /api/media
 * Ambil daftar semua file gambar dari R2 bucket
 * Bisa difilter dengan query param: ?prefix=content/ atau ?prefix=covers/
 */
export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    // Ambil parameter prefix dari query string kalau ada
    const { searchParams } = new URL(request.url);
    const prefix = searchParams.get('prefix') ?? undefined;

    const files = await listR2Files(prefix);

    // Urutkan dari yang paling baru diupload
    const sorted = files.sort(
      (a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
    );

    return NextResponse.json({ files: sorted });
  } catch (error: unknown) {
    const status = error instanceof Error && error.message === 'Unauthorized' ? 401 : 500;
    const message = error instanceof Error ? error.message : 'Gagal mengambil daftar media';
    return NextResponse.json({ error: message }, { status });
  }
}

/**
 * DELETE /api/media
 * Hapus file dari R2 berdasarkan "key" yang dikirim di body JSON
 * Body contoh: { "key": "content/1713256400000-gambar.png" }
 */
export async function DELETE(request: NextRequest) {
  try {
    await requireAdmin();

    const body = await request.json();
    const key = body?.key as string | undefined;

    if (!key) {
      return NextResponse.json({ error: 'Key file wajib disertakan' }, { status: 400 });
    }

    // Hapus file dari R2 menggunakan fungsi deleteFromR2 yang sudah ada
    await deleteFromR2(key);

    return NextResponse.json({ success: true, message: `File "${key}" berhasil dihapus` });
  } catch (error: unknown) {
    const status = error instanceof Error && error.message === 'Unauthorized' ? 401 : 500;
    const message = error instanceof Error ? error.message : 'Gagal menghapus file';
    return NextResponse.json({ error: message }, { status });
  }
}
