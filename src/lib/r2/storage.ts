import { r2Client, R2_BUCKET, getR2PublicUrl } from './client';
import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

/**
 * Model: R2 Storage Operations (MVC - Model Layer)
 * Fungsi-fungsi helper untuk operasi file di Cloudflare R2.
 */

/**
 * Upload file (Buffer) ke R2 bucket
 * @param key   - Nama/path file di dalam bucket, contoh: "covers/foto.jpg"
 * @param body  - Isi file dalam bentuk Buffer
 * @param contentType - MIME type file, contoh: "image/jpeg"
 * @returns URL publik file yang berhasil di-upload
 */
export async function uploadToR2(
  key: string,
  body: Buffer,
  contentType: string
): Promise<string> {
  await r2Client.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      Body: body,
      ContentType: contentType,
    })
  );
  return getR2PublicUrl(key);
}

/**
 * Hapus file dari R2 bucket berdasarkan key-nya
 * @param key - Nama/path file di dalam bucket
 */
export async function deleteFromR2(key: string): Promise<void> {
  await r2Client.send(
    new DeleteObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
    })
  );
}

/**
 * Buat key unik untuk upload file cover artikel
 * Contoh hasil: "covers/1713256400000-nama-file.jpg"
 */
export function createCoverKey(filename: string): string {
  const safeName = filename
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9.-]/g, '');
  return `covers/${Date.now()}-${safeName}`;
}

/**
 * Buat key unik untuk upload avatar/foto profil user
 * Contoh hasil: "avatars/1713256400000-foto.jpg"
 */
export function createAvatarKey(filename: string): string {
  const safeName = filename
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9.-]/g, '');
  return `avatars/${Date.now()}-${safeName}`;
}
