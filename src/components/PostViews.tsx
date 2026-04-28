'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function PostViews({ postId, initialViews }: { postId: string; initialViews?: number }) {
  const [views, setViews] = useState<number | null>(initialViews ?? null);

  useEffect(() => {
    async function fetchViews() {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        if (!supabaseUrl || supabaseUrl.includes('your-project')) return;

        const supabase = createClient();
        const { data } = await supabase
          .from('posts')
          .select('views')
          .eq('id', postId)
          .single();

        if (data?.views != null) setViews(data.views);
      } catch { /* abaikan error */ }
    }

    fetchViews();

    // subscribe realtime — update tampilan setiap ada perubahan views
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl || supabaseUrl.includes('your-project')) return;

    const supabase = createClient();
    const channel = supabase
      .channel(`post-views-${postId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'posts', filter: `id=eq.${postId}` },
        (payload) => {
          if (payload.new?.views != null) setViews(payload.new.views);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [postId]);

  if (views == null) return null;

  return (
    <span className="flex items-center gap-1">
      <span>•</span>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
      {views.toLocaleString('id-ID')} Views
    </span>
  );
}
