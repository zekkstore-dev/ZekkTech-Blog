import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import AdminThemeToggle from './AdminThemeToggle';

async function checkAuth() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl || supabaseUrl.includes('your-project')) {
      // Supabase not configured — allow access for demo
      return true;
    }
    const { createServerSupabaseClient } = await import('@/lib/supabase/server');
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    return !!user;
  } catch {
    return false;
  }
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthenticated = await checkAuth();

  if (!isAuthenticated) {
    redirect('/__admin/login');
  }

  return (
    <div className="admin-wrapper min-h-screen bg-gray-50 transition-colors duration-300">
      {/* Admin Header */}
      <header className="admin-header bg-white border-b border-gray-100 sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Image src="/images/ZekkTech.png" alt="ZekkTech" width={110} height={28} className="admin-logo h-[28px] w-auto relative top-0.5" />
            </Link>
            <span className="admin-subtitle text-sm font-medium text-gray-400 hidden sm:inline relative top-0.5">/ Admin Dashboard</span>
          </div>
          <div className="flex items-center gap-3">
            <AdminThemeToggle />
            <Link href="/" className="admin-back-link text-sm text-gray-500 hover:text-blue-500 transition-colors">
              ← Lihat Blog
            </Link>
          </div>
        </div>
      </header>

      {/* Admin Nav Tabs */}
      <div className="admin-nav max-w-7xl mx-auto px-6 py-6 border-b border-gray-200 transition-colors duration-300">
        <nav className="flex items-center gap-6 text-sm font-medium overflow-x-auto pb-1 scrollbar-hide">
          <Link href="/__admin" className="admin-nav-link text-gray-900 border-b-2 border-gray-900 pb-2 flex-shrink-0">Artikel</Link>
          <Link href="/__admin/subscribers" className="admin-nav-link-inactive text-gray-500 hover:text-gray-900 pb-2 flex-shrink-0">Subscribers</Link>
          <Link href="/__admin/comments" className="admin-nav-link-inactive text-gray-500 hover:text-gray-900 pb-2 flex-shrink-0">Komentar</Link>
          <Link href="/__admin/about" className="admin-nav-link-inactive text-gray-500 hover:text-gray-900 pb-2 flex-shrink-0">Tentang Saya</Link>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {children}
      </div>
    </div>
  );
}
