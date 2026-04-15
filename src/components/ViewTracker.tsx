'use client';

import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function ViewTracker({ postId }: { postId: string }) {
  useEffect(() => {
    async function trackView() {
      try {
         // Pastikan id bukan undefined dan kita sedang live bukan local dummy
         const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
         if (!supabaseUrl || supabaseUrl.includes('your-project')) return;

         const supabase = createClient();
         
         const { error } = await supabase
            .from('page_views')
            .insert([{
                post_id: postId,
                user_agent: window.navigator.userAgent,
                // Server generally tracks IP, in Client we bypass stringently or let DB capture. 
                // We'll leave it simple. Add logic later if strictly needed.
            }]);
            
         if (error) console.error('Tracking error:', error);
      } catch (err) {
         console.warn('Silent analytics drop:', err);
      }
    }
    
    // Slight debounce for legitimate view checking (e.g. they stayed > 2 seconds)
    const timeout = setTimeout(() => {
        trackView();
    }, 2000);
    
    return () => clearTimeout(timeout);
  }, [postId]);

  return null; // Komponen ini invisible, bekerja di background saja
}
