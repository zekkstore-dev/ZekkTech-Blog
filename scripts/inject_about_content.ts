/**
 * Script: inject_about_content.ts
 * Inject ulang konten profil Zakaria ke Supabase site_settings
 * Jalankan: npx tsx --env-file=.env.local scripts/inject_about_content.ts
 */

import { createClient } from '@supabase/supabase-js';

const PROFILE_JOB = 'UI/UX Designer · Frontend Developer · Freelancer';

const PROFILE_BIO = `Mahasiswa Teknik Informatika yang sudah terjun ke dunia freelance sejak 2020. Suka ngulik desain, koding, dan segala hal yang berbau teknologi.`;

const PROFILE_TECHS = JSON.stringify([
  'Figma', 'Adobe XD', 'Adobe Illustrator', 'Adobe Photoshop',
  'CapCut', 'Filmora',
  'React', 'Next.js', 'TailwindCSS',
  'MySQL', 'GitHub',
]);

const ABOUT_MARKDOWN = `**Awal Mula**

Sejak kelas 2 atau 3 SD sudah akrab dengan gadget dan terus penasaran cara kerjanya. Waktu kelas 6 SD mulai serius tertarik dengan dunia komputer.

**Latar Belakang**

Lulusan **SMK Multimedia** yang dibekali ilmu grafis, desain visual, dan rakit PC. Sekarang sedang menempuh kuliah di jurusan **Teknik Informatika**.

**Freelance Sejak 2020**

Aktif sebagai freelancer sejak 2020 sampai sekarang. Pernah membantu pelajar, UMKM, dan komunitas di bidang desain UI/UX, pembuatan website, dan branding visual.

**Tentang Blog Ini**

Blog ini tempat berbagi hal-hal yang dipelajari dari otodidak dan pengalaman langsung. Kalau ada pertanyaan atau mau diskusi soal proyek, langsung hubungi saya.
`;

async function main() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    console.error('Env tidak lengkap.');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, serviceKey);

  const updates = [
    { key: 'profile_job',   value: PROFILE_JOB,    label: 'Jabatan'       },
    { key: 'profile_bio',   value: PROFILE_BIO,    label: 'Bio singkat'   },
    { key: 'profile_techs', value: PROFILE_TECHS,  label: 'Tech Stack'    },
    { key: 'about_content', value: ABOUT_MARKDOWN, label: 'Konten About'  },
  ];

  console.log('Mengupdate site_settings...\n');

  for (const item of updates) {
    const { error } = await supabase
      .from('site_settings')
      .upsert({ key: item.key, value: item.value }, { onConflict: 'key' });

    if (error) {
      console.error(`  GAGAL ${item.label}:`, error.message);
    } else {
      console.log(`  OK  ${item.label}`);
    }
  }

  console.log('\nSelesai. Refresh /about untuk melihat hasilnya.');
}

main();
