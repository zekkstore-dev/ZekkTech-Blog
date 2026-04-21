'use client';

import { useEffect } from 'react';

/**
 * CopyProtection — komponen global untuk:
 * 1. Intercept event "copy" di konten artikel (.post-content-card)
 *    dan append teks source attribution otomatis
 * 2. Blokir klik kanan di seluruh halaman kecuali area artikel
 */
export default function CopyProtection() {
  useEffect(() => {
    // ─── 1. APPEND ATTRIBUTION SAAT COPY DI DALAM KONTEN ARTIKEL ─────────────
    const handleCopy = (e: ClipboardEvent) => {
      // Cek apakah copy dilakukan di dalam .post-content-card (konten artikel)
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) return;

      const range = selection.getRangeAt(0);
      const container = range.commonAncestorContainer;

      // Naiki DOM tree untuk cek apakah ada di dalam .post-content-card
      let el: Node | null = container;
      let isInsideArticle = false;
      while (el) {
        if (el instanceof HTMLElement && el.classList.contains('post-content-card')) {
          isInsideArticle = true;
          break;
        }
        el = el.parentNode;
      }

      if (!isInsideArticle) return; // bukan di artikel, abaikan

      // Teks yang diseleksi user
      const selectedText = selection.toString();
      if (!selectedText.trim()) return;

      // Teks attribution yang akan ditempel di bawah hasil copy
      const attribution = `\n\n---\nSumber: ZekkTech Blog oleh Zakaria MP\nWebsite: https://zekktech.biz.id\nKomunitas WhatsApp: https://chat.whatsapp.com/BiwktQom1QS0n588Nw6B8j`;

      const finalText = selectedText + attribution;

      // Override clipboard dengan teks yang sudah ada attribution-nya
      e.clipboardData?.setData('text/plain', finalText);
      e.preventDefault();
    };

    // ─── 2. BLOKIR KLIK KANAN DI LUAR KONTEN ARTIKEL ─────────────────────────
    const handleContextMenu = (e: MouseEvent) => {
      // Cek apakah klik kanan di dalam konten artikel
      let el = e.target as HTMLElement | null;
      let isInsideArticle = false;
      while (el) {
        if (el.classList?.contains('post-content-card')) {
          isInsideArticle = true;
          break;
        }
        el = el.parentElement;
      }

      // Blokir klik kanan di luar artikel
      if (!isInsideArticle) {
        e.preventDefault();
      }
    };

    document.addEventListener('copy', handleCopy);
    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  return null; // tidak render apapun ke UI
}
