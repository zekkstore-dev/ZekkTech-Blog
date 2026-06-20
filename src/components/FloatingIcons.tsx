'use client';

import { useEffect, useMemo, useState } from 'react';

interface IconConfig {
  src: string;
  size: number;    // px
  x: number;       // % dari lebar viewport
  y: number;       // % dari tinggi total halaman
  rotation: number; // derajat
  opacity: number; // 0-1
}

// Seed-based pseudo-random untuk SSR-safe deterministik
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const ICON_SOURCES = [
  '/images/icon/figma.png',
  '/images/icon/photoshop.png',
  '/images/icon/canva.png',
  '/images/icon/corel.png',
];

function generateIcons(count: number): IconConfig[] {
  const rng = seededRandom(42);
  const icons: IconConfig[] = [];
  
  // Bagi halaman menjadi grid untuk mencegah tumpang tindih
  // 2 kolom (kiri & kanan) x N baris
  const rows = Math.ceil(count / 2);
  const rowHeight = 80 / rows; // 80% height dibagi ke N baris agar tidak terlalu ke bawah
  
  for (let i = 0; i < count; i++) {
    const isLeft = i % 2 === 0;
    const row = Math.floor(i / 2);
    
    // Posisi X: kiri (2-12%) atau kanan (88-98%)
    const x = isLeft 
      ? 2 + rng() * 10    // 2–12% (kiri, padding dari edge)
      : 88 + rng() * 10;  // 88–98% (kanan, padding dari edge)
    
    // Posisi Y: dalam barisnya masing-masing dengan variasi kecil
    const yBase = 5 + row * rowHeight;
    const y = yBase + rng() * (rowHeight * 0.6); // 60% dari row height untuk variasi
    
    icons.push({
      src: ICON_SOURCES[i % ICON_SOURCES.length],
      size: 35 + rng() * 50,           // 35–85px (sedikit lebih kecil agar muat banyak)
      x: x,
      y: Math.min(y, 85),              // max 85% agar tidak terlalu ke bawah dekat footer
      rotation: -30 + rng() * 60,      // kemiringan halus -30° s/d +30° biar tidak terbalik ke bawah
      opacity: 0.5,                    // 50% transparan
    });
  }

  return icons;
}

export default function FloatingIcons() {
  // Gunakan useMemo + seed deterministic supaya SSR dan client match
  const icons = useMemo(() => generateIcons(40), []);

  // State kosong untuk mencegah hydration mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Render kosong dulu saat SSR, lalu tampilkan setelah mount
  if (!mounted) return null;

  return (
    <div className="floating-icons" aria-hidden="true">
      {icons.map((icon, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={i}
          src={icon.src}
          alt=""
          className="floating-icon"
          style={{
            position: 'absolute',
            left: `${icon.x}%`,
            top: `${icon.y}%`,
            width: `${icon.size}px`,
            height: `${icon.size}px`,
            objectFit: 'contain',
            transform: `rotate(${icon.rotation}deg)`,
            opacity: icon.opacity,
            pointerEvents: 'none',
            userSelect: 'none',
            zIndex: 0,
          }}
        />
      ))}
    </div>
  );
}