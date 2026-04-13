import { notFound } from 'next/navigation';
import PostForm from '@/components/PostForm';
import { seedPosts } from '@/lib/seed-data';
import type { Post } from '@/types/post';

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getPost(id: string): Promise<Post | null> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl || supabaseUrl.includes('your-project')) {
      return seedPosts.find((p) => p.id === id) || null;
    }
    const { createServerSupabaseClient } = await import('@/lib/supabase/server');
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single();
    return data || seedPosts.find((p) => p.id === id) || null;
  } catch {
    return seedPosts.find((p) => p.id === id) || null;
  }
}

export default async function EditPostPage({ params }: PageProps) {
  const { id } = await params;
  const post = await getPost(id);

  if (!post) notFound();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Edit Artikel</h1>
        <p className="text-sm text-gray-500 mt-1">Perbarui konten artikel &quot;{post.title}&quot;</p>
      </div>
      <PostForm mode="edit" post={post} />
    </div>
  );
}
