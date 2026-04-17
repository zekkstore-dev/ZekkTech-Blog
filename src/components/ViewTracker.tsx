'use client';

import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function ViewTracker({ postId }: { postId: string }) {
  useEffect(() => {
    async function trackView() {
      try {
         // skip kalo masih pake data dummy lokal
         const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
         if (!supabaseUrl || supabaseUrl.includes('your-project')) return;

         const supabase = createClient();
         
         const { error } = await supabase
            .from('page_views')
            .insert([{
                post_id: postId,
                user_agent: window.navigator.userAgent,
                // ip dihandle di server, disini cukup user agent aja dulu
            }]);
            
         if (error) console.error('gagal track view:', error);
      } catch (err) {
         console.warn('gagal track view (diabaikan):', err);
      }
    }
    
    // kasih delay 2 detik, baru dianggep beneran baca (bukan bot)
    const timeout = setTimeout(() => {
        trackView();
    }, 2000);
    
    return () => clearTimeout(timeout);
  }, [postId]);

  return null; // komponen hantu, ga nampil di layar tapi kerja di belakang
}
