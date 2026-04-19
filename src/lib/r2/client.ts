import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';

/**
 * Model: R2 Storage Client (MVC - Model Layer)
 * Lazy singleton instance of Cloudflare R2 S3-compatible client.
 * intinya semua koneksi ke R2 (upload, delete, check) bermula dari sini.
 * 
 * PENTING: Validasi env var dilakukan secara LAZY (saat pertama kali dipanggil),
 * BUKAN di module-level, supaya build tidak crash di serverless (Netlify).
 */

let _r2Client: S3Client | null = null;
let _r2Bucket: string | null = null;
let _r2PublicDomain: string | null = null;

/**
 * Mendapatkan R2 S3 client (singleton, lazy-initialized)
 * Throw error kalau env var belum diset — tapi cuma saat runtime, bukan saat import.
 */
export function getR2Client(): S3Client {
  if (!_r2Client) {
    const accountId = process.env.R2_ACCOUNT_ID;
    const accessKeyId = process.env.R2_ACCESS_KEY_ID;
    const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

    if (!accountId) throw new Error('[R2] R2_ACCOUNT_ID tidak ditemukan di environment variables');
    if (!accessKeyId) throw new Error('[R2] R2_ACCESS_KEY_ID tidak ditemukan di environment variables');
    if (!secretAccessKey) throw new Error('[R2] R2_SECRET_ACCESS_KEY tidak ditemukan di environment variables');

    _r2Client = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      forcePathStyle: true,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }
  return _r2Client;
}

/**
 * Mendapatkan nama bucket R2 (lazy)
 */
export function getR2Bucket(): string {
  if (!_r2Bucket) {
    const bucketName = process.env.R2_BUCKET_NAME;
    if (!bucketName) throw new Error('[R2] R2_BUCKET_NAME tidak ditemukan di environment variables');
    _r2Bucket = bucketName;
  }
  return _r2Bucket;
}

/**
 * Mendapatkan domain publik R2 (lazy)
 */
export function getR2PublicDomain(): string {
  if (_r2PublicDomain === null) {
    _r2PublicDomain = process.env.NEXT_PUBLIC_R2_DOMAIN?.replace(/\/$/, '') || '';
  }
  return _r2PublicDomain;
}

/**
 * Bikin link url publik (bisa diakses via web) dari nama file di r2
 */
export function getR2PublicUrl(key: string): string {
  return `${getR2PublicDomain()}/${key}`;
}

/**
 * Buat ngetes aja konek apa engga (Health Check)
 */
export async function checkR2Connection(): Promise<{
  connected: boolean;
  bucketName: string;
  error?: string;
}> {
  try {
    const client = getR2Client();
    const bucket = getR2Bucket();
    // test tarik 1 file objek pake List buat ngecek aja ada permission ato ngga
    await client.send(
      new ListObjectsV2Command({ Bucket: bucket, MaxKeys: 1 })
    );
    return { connected: true, bucketName: bucket };
  } catch (err: unknown) {
    const e = err as { name?: string; message?: string; $metadata?: { httpStatusCode?: number } };
    const detail = `[${e.name || 'Error'}] HTTP ${e.$metadata?.httpStatusCode || 'N/A'}: ${e.message}`;
    console.error('[R2 Health Check Failed]', detail);
    return { connected: false, bucketName: process.env.R2_BUCKET_NAME || 'unknown', error: detail };
  }
}

/**
 * ngelist semua file di mangkok r2 kita (biasanya buat debbuging)
 */
export async function listR2Files(prefix?: string) {
  const client = getR2Client();
  const bucket = getR2Bucket();
  const result = await client.send(
    new ListObjectsV2Command({
      Bucket: bucket,
      Prefix: prefix,
      MaxKeys: 50,
    })
  );
  return result.Contents || [];
}
