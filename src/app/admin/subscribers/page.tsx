import { formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

async function getSubscribers() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl || supabaseUrl.includes('your-project')) {
      return [{ id: '1', email: 'dummy@example.com', created_at: new Date().toISOString() }];
    }
    const { createServerSupabaseClient } = await import('@/lib/supabase/server');
    const supabase = await createServerSupabaseClient();
    
    // Server-side call
    const { data } = await supabase
      .from('subscribers')
      .select('*')
      .order('created_at', { ascending: false });
      
    return data || [];
  } catch {
    return [];
  }
}

export default async function SubscribersDashboard() {
  const subscribers = await getSubscribers();

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Daftar Kumpulan Email</h1>
          <p className="text-sm text-gray-500 mt-1">{subscribers.length} audiens Newsletter</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="bg-gray-50/50 text-gray-700 font-semibold border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Email Pelanggan</th>
                <th className="px-6 py-4">Tgl. Berlangganan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {subscribers.length === 0 ? (
                <tr>
                  <td colSpan={2} className="px-6 py-8 text-center text-gray-400">Belum ada pelanggan.</td>
                </tr>
              ) : subscribers.map((sub) => (
                <tr key={sub.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{sub.email}</td>
                  <td className="px-6 py-4 text-gray-500">{formatDate(sub.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
