import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';

/**
 * Model: R2 Storage Client (MVC - Model Layer)
 * Singleton instance of Cloudflare R2 S3-compatible client.
 * intinya semua koneksi ke R2 (upload, delete, check) bermula dari sini.
 */

if (!process.env.R2_ACCOUNT_ID) throw new Error('[R2] R2_ACCOUNT_ID tidak ditemukan di .env.local');
if (!process.env.R2_ACCESS_KEY_ID) throw new Error('[R2] R2_ACCESS_KEY_ID tidak ditemukan di .env.local');
if (!process.env.R2_SECRET_ACCESS_KEY) throw new Error('[R2] R2_SECRET_ACCESS_KEY tidak ditemukan di .env.local');
if (!process.env.R2_BUCKET_NAME) throw new Error('[R2] R2_BUCKET_NAME tidak ditemukan di .env.local');

export const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export const R2_BUCKET = process.env.R2_BUCKET_NAME!;
export const R2_PUBLIC_DOMAIN = process.env.NEXT_PUBLIC_R2_DOMAIN?.replace(/\/$/, '') || '';

/**
 * Bikin link url publik (bisa diakses via web) dari nama file di r2
 */
export function getR2PublicUrl(key: string): string {
  return `${R2_PUBLIC_DOMAIN}/${key}`;
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
    // test tarik 1 file objek pake List buat ngecek aja ada permission ato ngga
    await r2Client.send(
      new ListObjectsV2Command({ Bucket: R2_BUCKET, MaxKeys: 1 })
    );
    return { connected: true, bucketName: R2_BUCKET };
  } catch (err: unknown) {
    const e = err as { name?: string; message?: string; $metadata?: { httpStatusCode?: number } };
    const detail = `[${e.name || 'Error'}] HTTP ${e.$metadata?.httpStatusCode || 'N/A'}: ${e.message}`;
    console.error('[R2 Health Check Failed]', detail);
    return { connected: false, bucketName: R2_BUCKET, error: detail };
  }
}

/**
 * ngelist semua file di mangkok r2 kita (biasanya buat debbuging)
 */
export async function listR2Files(prefix?: string) {
  const result = await r2Client.send(
    new ListObjectsV2Command({
      Bucket: R2_BUCKET,
      Prefix: prefix,
      MaxKeys: 50,
    })
  );
  return result.Contents || [];
}
