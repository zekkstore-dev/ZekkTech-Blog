import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  try {
    const { email, token } = await req.json();

    if (!email || !token) {
      return NextResponse.json(
        { error: 'Email and Turnstile token are required' },
        { status: 400 }
      );
    }

    // validasi turnstile dulu masbro
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
        { error: 'Failed to verify Turnstile challenge' },
        { status: 403 }
      );
    }

    // kalau botnya ketendang, baru masukin ke database aman
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase
      .from('subscribers')
      .insert([{ email: email.trim() }]);

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'Email ini sudah berlangganan sebelumnya.' },
          { status: 400 }
        );
      }
      console.error('Supabase Subscribe Error:', error);
      return NextResponse.json(
        { error: 'Gagal berlangganan. Silakan coba lagi.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: 'Berhasil berlangganan!' });
  } catch (err: any) {
    console.error('Subscribe API Error:', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
