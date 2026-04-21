import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
// import createContentKey juga agar bisa membedakan folder berdasarkan parameter
import { uploadToR2, createCoverKey, createContentKey } from '@/lib/r2/storage';

// filter tipe file yang boleh masuk
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export async function POST(request: NextRequest) {
  try {
    // mastiin cuma admin yang bisa nge-upload gambar
    const supabase = await createServerSupabaseClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // tarik filenya dari form data
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    // parameter folder: 'content' untuk gambar isi artikel, default ke 'cover'
    const folder = (formData.get('folder') as string | null) ?? 'cover';

    if (!file) {
      return NextResponse.json({ error: 'File wajib dikirim' }, { status: 400 });
    }

    // cek tipe file, jangan sampe ada yang iseng upload script .sh atau .exe
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Hanya JPG, PNG, dan WEBP yang diperbolehkan' },
        { status: 400 }
      );
    }

    // pastikan ukuran filenya ga kegedean bikin server jebol
    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { error: `File terlalu besar. Maksimal 5MB (saat ini: ${(file.size / 1024 / 1024).toFixed(1)}MB)` },
        { status: 400 }
      );
    }

    // ubah ke raw buffer lalu tentukan key berdasarkan folder tujuan
    const buffer = Buffer.from(await file.arrayBuffer());
    // kalau folder === 'content', simpan di content/, selain itu di covers/
    const key = folder === 'content'
      ? createContentKey(file.name)
      : createCoverKey(file.name);
    const publicUrl = await uploadToR2(key, buffer, file.type);

    return NextResponse.json({ publicUrl, key });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Upload gagal';
    console.error('[R2 Upload Error]', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
