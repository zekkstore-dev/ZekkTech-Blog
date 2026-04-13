# ZekkTech — Blog Teknologi Indonesia

Blog teknologi modern oleh Zakaria MP (ZekkTech). Dibangun dengan Next.js 15, Tailwind CSS, dan Supabase.

![ZekkTech Preview](./assets/ZekkTech-Landing-Page.png)

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, TypeScript)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Database & Auth**: [Supabase](https://supabase.com/)
- **Font**: [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans)

## Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/ZekkTechBlog.git
cd ZekkTechBlog
npm install
```

### 2. Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` dengan Supabase credentials kamu:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

> **Note:** Aplikasi bisa berjalan tanpa Supabase — akan menggunakan seed data demo.

### 3. Database Setup (Optional)

Jalankan `supabase-schema.sql` di Supabase SQL Editor untuk membuat tabel `posts`.

### 4. Run Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

## Routes

| Route | Deskripsi |
|-------|-----------|
| `/` | Homepage |
| `/post/[slug]` | Detail artikel |
| `/login` | Login admin |
| `/admin` | Dashboard admin |
| `/admin/new` | Buat artikel baru |
| `/admin/edit/[id]` | Edit artikel |

## Deploy ke Netlify

1. Push repo ke GitHub
2. Buka [Netlify](https://app.netlify.com) → **Add new site** → **Import from Git**
3. Pilih repo `ZekkTechBlog`
4. Build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
5. Tambahkan Environment Variables di **Site settings → Environment variables**
6. Deploy!

## License

MIT © ZakariaMP
