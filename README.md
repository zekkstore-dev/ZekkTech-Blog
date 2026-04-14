# ZekkTech Blog

A modern and professional tech blog platform developed by **ZekkStore**. This platform provides high-quality technical articles, tutorials, and insights into web development, software engineering, and modern technology stack.

## Tech Stack

This project is built using modern web development technologies:

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database / Backend**: [Supabase](https://supabase.com/) (`@supabase/supabase-js` & `@supabase/ssr`)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

Make sure to set up your `.env.local` with the appropriate Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```
