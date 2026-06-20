/**
 * Utility to convert JPG, PNG, WEBP, and SVG to optimized WebP format client-side.
 * This improves website performance by rendering lightweight WebP assets and saving bandwidth.
 */
export function convertToWebP(file: File, quality = 0.82): Promise<File> {
  return new Promise((resolve) => {
    // Skip conversion for non-images, PDFs, or animated GIFs
    if (
      file.type === 'application/pdf' ||
      file.type === 'image/gif' ||
      !file.type.startsWith('image/')
    ) {
      return resolve(file);
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          let width = img.naturalWidth || img.width;
          let height = img.naturalHeight || img.height;

          // Fallback dimensions if natural size is not detectable (e.g. some SVGs)
          if (width === 0 || height === 0) {
            width = 1200;
            height = 1200;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            return resolve(file); // Fallback to original
          }

          // Fill canvas with white background if source is JPEG/PNG with transparency to avoid black borders (optional, but drawing transparent WebP is standard)
          // For transparency preservation, we just draw directly
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to WebP blob
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                return resolve(file);
              }
              const nameWithoutExtension = file.name.replace(/\.[^.]+$/, '');
              const newFile = new File([blob], `${nameWithoutExtension}.webp`, {
                type: 'image/webp',
                lastModified: Date.now(),
              });
              resolve(newFile);
            },
            'image/webp',
            quality
          );
        } catch (err) {
          console.error('[WebP Conversion Error]', err);
          resolve(file); // Fallback to original file on error
        }
      };

      img.onerror = () => {
        resolve(file); // Fallback to original file
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      resolve(file);
    };

    reader.readAsDataURL(file);
  });
}
