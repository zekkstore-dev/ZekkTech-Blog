import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Parse env file manually
const envPath = path.resolve('.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    const key = match[1];
    let value = match[2] || '';
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.substring(1, value.length - 1);
    } else if (value.startsWith("'") && value.endsWith("'")) {
      value = value.substring(1, value.length - 1);
    }
    env[key] = value.trim();
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Kesalahan: Variabel URL atau Key Supabase kamu belum diatur di .env.local!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("Fetching current experiences...");
  const { data: currentExps, error: fetchErr } = await supabase
    .from('experiences')
    .select('*');

  if (fetchErr) {
    console.error("Error fetching: ", fetchErr);
    process.exit(1);
  }

  console.log("Current experiences count:", currentExps ? currentExps.length : 0);
  console.log(JSON.stringify(currentExps, null, 2));

  const newVolunteers = [
    {
      title: 'Kepala Divisi Media Creative',
      company: 'Himpunan Mahasiswa Informatika (HIMADIF) UTM',
      location: 'Bangkalan',
      start_date: '2024-09',
      end_date: 'Present',
      description: 'Menjabat sebagai Kepala Divisi Media Creative di Himpunan Mahasiswa, memimpin tim dalam merancang identitas visual, media publikasi kegiatan, dokumentasi, serta manajemen konten sosial media organisasi.',
      type: 'Volunteers'
    },
    {
      title: 'Core Team Media Creative',
      company: 'Google Developer Groups on Campus (GDGoC) Universitas Trunojoyo Madura',
      location: 'Bangkalan',
      start_date: '2024-10',
      end_date: 'Present',
      description: 'Sebagai Core Team di Divisi Media Creative, bertanggung jawab dalam mendesain materi visual workshop teknologi, mengelola branding visual GDGoC di platform sosial media, serta memproduksi konten kreatif seputar program Google.',
      type: 'Volunteers'
    },
    {
      title: 'Kepala Divisi Media Creative',
      company: 'Koalisi Komunitas Linux dan Cyber Security (KKLCS)',
      location: 'Bangkalan',
      start_date: '2024-10',
      end_date: 'Present',
      description: 'Memimpin Divisi Media Creative untuk merancang aset digital publikasi, mendesain infografis edukasi seputar open source, distro Linux, dan awareness keamanan siber bagi khalayak umum.',
      type: 'Volunteers'
    }
  ];

  console.log("Checking if new volunteers are already added...");
  const toInsert = [];
  for (const vol of newVolunteers) {
    const exists = currentExps?.some(exp => exp.title === vol.title && exp.company === vol.company);
    if (!exists) {
      toInsert.push(vol);
    }
  }

  if (toInsert.length > 0) {
    console.log(`Inserting ${toInsert.length} new volunteer experiences...`);
    const { data: inserted, error: insertErr } = await supabase
      .from('experiences')
      .insert(toInsert)
      .select();

    if (insertErr) {
      console.error("Error inserting: ", insertErr);
    } else {
      console.log("Successfully inserted:", inserted);
    }
  } else {
    console.log("All volunteer experiences already exist in database.");
  }
}

run();
