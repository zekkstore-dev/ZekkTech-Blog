'use client';

import React from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/motion-primitives/accordion';
import { ChevronRight } from 'lucide-react';

export default function MotionFAQ() {
  const faqs = [
    {
      id: 'apa-itu-zekktech',
      question: 'Apa itu ZekkTech Blog?',
      answer:
        'ZekkTech Blog adalah platform berbagi wawasan seputar teknologi, tutorial pemrograman, dan inovasi digital terkini yang disajikan secara mendalam dan praktis untuk developer Indonesia.',
    },
    {
      id: 'cara-berlangganan',
      question: 'Bagaimana cara mendapatkan update artikel terbaru?',
      answer:
        'Anda bisa memasukkan email Anda di kolom "Berlangganan" yang ada di bagian bawah setiap halaman. Kami akan mengirimkan notifikasi otomatis ke inbox ketika artikel baru dirilis. Tenang saja, kami tidak akan menyebarkan spam.',
    },
    {
      id: 'cara-kontribusi',
      question: 'Apakah saya bisa ikut menulis atau berkontribusi?',
      answer:
        'Saat ini ZekkTech masih dikelola secara tertutup, namun kami sangat terbuka untuk kolaborasi di masa depan. Anda bisa menghubungi langsung kontak penulis di menu Tentang Saya.',
    },
    {
      id: 'kategori',
      question: 'Topik apa saja yang dibahas di blog ini?',
      answer:
        'Kami fokus pada Pengembangan Web (Frontend & Backend), DevOps, Pilihan Template, dan Berita Teknologi secara umum.',
    },
  ];

  return (
    <section className="py-20 bg-[var(--bg-primary)] transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-[var(--text-primary)]">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="mt-4 text-[var(--text-secondary)]">
            Temukan jawaban singkat untuk hal-hal yang sering ditanyakan seputar ZekkTech Blog.
          </p>
        </div>

        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl p-6 shadow-sm">
          <Accordion
            className="flex w-full flex-col"
            transition={{ type: 'tween', ease: 'easeInOut', duration: 0.25 }}
            variants={{
              expanded: {
                opacity: 1,
              },
              collapsed: {
                opacity: 0,
              },
            }}
          >
            {faqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id} className="py-3 border-b border-[var(--border)] last:border-0 last:pb-0 first:pt-0">
                <AccordionTrigger className="group w-full py-2 text-left text-[var(--text-primary)] hover:text-blue-500 transition-colors">
                  <div className="flex items-center">
                    <ChevronRight className="h-5 w-5 text-[var(--text-secondary)] transition-transform duration-200 group-data-expanded:rotate-90 group-hover:text-blue-500" />
                    <div className="ml-3 font-medium text-[16px]">
                      {faq.question}
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="origin-left overflow-hidden">
                  <p className="pl-8 pr-4 pt-2 pb-4 text-[15px] leading-relaxed text-[var(--text-secondary)]">
                    {faq.answer}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
