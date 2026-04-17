import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  try {
    const { postId, name, email, content, token } = await req.json();

    if (!postId || !name || !email || !content || !token) {
      return NextResponse.json(
        { error: 'Semua kolom dan token Cloudflare wajib diisi' },
        { status: 400 }
      );
    }

    // panggil satpam turnstile buat ngecek
    const verifyFormData = new FormData();
    verifyFormData.append('secret', process.env.TURNSTILE_SECRET_KEY!);
    verifyFormData.append('response', token);

    const verifyRes = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        body: verifyFormData,
      }
    );

    const verifyData = await verifyRes.json();

    if (!verifyData.success) {
      return NextResponse.json(
        { error: 'Gagal verifikasi captcha ghaib (Turnstile).' },
        { status: 403 }
      );
    }

    const supabase = await createServerSupabaseClient();

    // cek dia beneran udah subscribe apa numpang lewat doang
    const { data: subscriber, error: subError } = await supabase
      .from('subscribers')
      .select('id')
      .eq('email', email)
      .single();

    if (subError || !subscriber) {
      return NextResponse.json(
        { error: 'Anda harus berlangganan Newsletter terlebih dahulu sebelum bisa berkomentar.' },
        { status: 403 }
      );
    }

    // lempar ke db buat di review admin nanti
    const { error: commentError } = await supabase
      .from('comments')
      .insert([
        {
          post_id: postId,
          user_name: name,
          user_email: email,
          content: content,
          is_approved: false, // Menunggu persetujuan admin
        },
      ]);

    if (commentError) {
      console.error('Insert Comment Error:', commentError);
      return NextResponse.json(
        { error: 'Gagal mengirim komentar. Coba lagi nanti.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: 'Komentar terkirim! Menunggu persetujuan Admin.' });
  } catch (err: any) {
    console.error('Comments API Error:', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
