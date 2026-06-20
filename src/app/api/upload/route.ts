import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { uploadToR2, createCoverKey, createContentKey } from '@/lib/r2/storage';

// filter tipe file yang boleh masuk
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
const ALLOWED_PDF_TYPES = ['application/pdf'];
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB (untuk PDF)

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
    // parameter folder: 'content'|'covers'|'avatars'|'documents'
    const folder = (formData.get('folder') as string | null) ?? 'covers';

    if (!file) {
      return NextResponse.json({ error: 'File wajib dikirim' }, { status: 400 });
    }

    const isPdf = ALLOWED_PDF_TYPES.includes(file.type);
    const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);

    if (!isPdf && !isImage) {
      return NextResponse.json(
        { error: 'Hanya JPG, PNG, WEBP, GIF, dan PDF yang diperbolehkan' },
        { status: 400 }
      );
    }

    // pastikan ukuran filenya ga kegedean
    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { error: `File terlalu besar. Maksimal 10MB (saat ini: ${(file.size / 1024 / 1024).toFixed(1)}MB)` },
        { status: 400 }
      );
    }

    // ubah ke raw buffer
    let buffer = Buffer.from(await file.arrayBuffer());
    let contentType = file.type;
    let fileName = file.name;

    // Otomatis konversi JPEG, PNG, dan SVG ke WebP di server
    const shouldConvert = ['image/jpeg', 'image/png', 'image/svg+xml'].includes(file.type);
    if (shouldConvert) {
      try {
        const sharp = (await import('sharp')).default;
        const webpBuffer = await sharp(buffer).webp({ quality: 82 }).toBuffer();
        buffer = Buffer.from(webpBuffer);
        contentType = 'image/webp';
        // Ubah ekstensi file menjadi .webp
        fileName = file.name.replace(/\.[^.]+$/, '') + '.webp';
      } catch (sharpError) {
        console.error('[Server WebP Conversion Failed, uploading original]', sharpError);
      }
    }
    
    let key: string;
    if (folder === 'content') {
      key = createContentKey(fileName);
    } else if (folder === 'avatars') {
      key = `avatars/${Date.now()}-${fileName}`;
    } else if (folder === 'documents') {
      key = `documents/${Date.now()}-${fileName}`;
    } else {
      key = createCoverKey(fileName);
    }

    const publicUrl = await uploadToR2(key, buffer, contentType);

    return NextResponse.json({ publicUrl, key });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Upload gagal';
    console.error('[R2 Upload Error]', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

