'use client';

import { SlidingNumber } from '@/components/motion-primitives/sliding-number';
import { useEffect, useState } from 'react';

interface LiveClockProps {
  /** 'compact' = ukuran kecil untuk card list, 'full' = ukuran besar untuk sidebar artikel */
  variant?: 'compact' | 'full';
}

export default function LiveClock({ variant = 'compact' }: LiveClockProps) {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // placeholder aman sebelum client mount (hindari hydration mismatch)
  if (!time) {
    return variant === 'full' ? (
      <span className="inline-flex items-center gap-1 font-mono text-2xl font-bold text-gray-300">
        --:--:-- <span className="text-base">--</span>
      </span>
    ) : (
      <span className="inline-flex items-center gap-0.5 font-mono text-[11px] text-gray-400">
        --:--:-- --
      </span>
    );
  }

  const hours12 = time.getHours() % 12 || 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const meridiem = time.getHours() >= 12 ? 'PM' : 'AM';

  if (variant === 'full') {
    return (
      <div className="flex flex-col items-center gap-1" title="Waktu lokal Anda saat ini">
        <div className="flex items-center gap-1 font-mono text-3xl font-bold text-[var(--text-primary)] tabular-nums">
          <SlidingNumber value={hours12} padStart={true} />
          <span className="text-gray-300 leading-none -mt-1">:</span>
          <SlidingNumber value={minutes} padStart={true} />
          <span className="text-gray-300 leading-none -mt-1">:</span>
          <SlidingNumber value={seconds} padStart={true} />
          <span className="ml-1 text-lg font-bold text-blue-500">{meridiem}</span>
        </div>
      </div>
    );
  }

  // variant compact (default) — untuk ArticleCard atau konteks kecil
  return (
    <span
      className="inline-flex items-center gap-0.5 font-mono text-[11px] text-gray-400"
      title="Waktu lokal Anda saat ini"
    >
      <SlidingNumber value={hours12} padStart={true} />
      <span className="text-gray-300 -mt-px">:</span>
      <SlidingNumber value={minutes} padStart={true} />
      <span className="text-gray-300 -mt-px">:</span>
      <SlidingNumber value={seconds} padStart={true} />
      <span className="ml-0.5 font-semibold text-blue-400">{meridiem}</span>
    </span>
  );
}
