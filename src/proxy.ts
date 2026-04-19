import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Middleware utama untuk ZekkTech Blog.
 * 
 * Fungsi utama:
 * 1. Me-refresh access token Supabase Auth sebelum expired
 * 2. Memperbarui cookie sesi pada setiap request
 * 3. Memastikan halaman admin terlindungi (sudah di-handle juga oleh admin/layout.tsx)
 * 
 * PENTING: Tanpa middleware ini, cookie sesi Supabase TIDAK akan di-refresh otomatis,
 * sehingga user akan logout tiba-tiba setelah ~1 jam.
 */
export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Kalo supabase belum di-setup, skip middleware
  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your-project')) {
    return supabaseResponse;
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Set cookies di request supaya Server Component bisa baca
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          // Buat response baru dengan cookies yang sudah di-update
          supabaseResponse = NextResponse.next({
            request,
          });
          // Set cookies di response supaya browser bisa simpan
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // PENTING: Jangan pake getSession() — bisa aja dari cache lama.
  // getUser() selalu validasi ke Supabase Auth server jadi lebih aman.
  await supabase.auth.getUser();

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Cocokkan semua request paths KECUALI yang dimulai dengan:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images/ (public images folder)
     * - file.svg, globe.svg, dll (public assets)
     */
    '/((?!_next/static|_next/image|favicon.ico|images/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
