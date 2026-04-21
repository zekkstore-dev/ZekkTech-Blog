import { getR2Client, getR2Bucket, getR2PublicUrl } from './client';
import { PutObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';

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
  const client = getR2Client();
  const bucket = getR2Bucket();
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
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
  const client = getR2Client();
  const bucket = getR2Bucket();
  await client.send(
    new DeleteObjectCommand({
      Bucket: bucket,
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

/**
 * Buat key unik untuk upload gambar isi/konten artikel
 * Disimpan di folder "content/" agar terpisah dari cover
 * Contoh hasil: "content/1713256400000-diagram.png"
 */
export function createContentKey(filename: string): string {
  const safeName = filename
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9.-]/g, '');
  return `content/${Date.now()}-${safeName}`;
}

/**
 * Ambil semua file yang ada di R2 bucket sesuai prefix folder
 * Digunakan oleh Media Library di halaman Admin
 * @param prefix - Filter folder, contoh: "content/" atau "covers/" (opsional)
 * @returns Array of { key, url, size, lastModified }
 */
export async function listR2Files(prefix?: string): Promise<{ key: string; url: string; size: number; lastModified: Date }[]> {
  const client = getR2Client();
  const bucket = getR2Bucket();

  const command = new ListObjectsV2Command({
    Bucket: bucket,
    // kalau ada prefix, filter sesuai folder; default ambil semua
    Prefix: prefix ?? undefined,
  });

  const response = await client.send(command);

  // Ubah hasil ListObjects menjadi format yang lebih mudah dipakai di frontend
  return (response.Contents ?? []).map((item) => ({
    key: item.Key ?? '',
    url: getR2PublicUrl(item.Key ?? ''),
    size: item.Size ?? 0,
    lastModified: item.LastModified ?? new Date(),
  }));
}
