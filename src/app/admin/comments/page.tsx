import AdminCommentsTable from '@/components/AdminCommentsTable';

export const dynamic = 'force-dynamic';

async function getComments() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl || supabaseUrl.includes('your-project')) {
      return [];
    }
    const { createServerSupabaseClient } = await import('@/lib/supabase/server');
    const supabase = await createServerSupabaseClient();
    
    // JOIN posts to get the title for context
    const { data } = await supabase
      .from('comments')
      .select('*, posts(title, slug)')
      .order('created_at', { ascending: false });
      
    return data || [];
  } catch {
    return [];
  }
}

export default async function CommentsDashboard() {
  const comments = await getComments();

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Moderasi Komentar</h1>
          <p className="text-sm text-gray-500 mt-1">{comments.length} umpan balik tercatat</p>
        </div>
      </div>

      <AdminCommentsTable initialComments={comments} />
    </div>
  );
}
