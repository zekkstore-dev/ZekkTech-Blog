'use client';

import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loginAction } from './actions';

export default function LoginPage() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(loginAction, {});

  useEffect(() => {
    if (state?.success) {
      router.push('/admin');
      router.refresh(); // refresh biar cookie barunya kebaca
    }
  }, [state?.success, router]);

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-0 mb-3">
            <span className="text-[32px] font-extrabold text-gray-900 tracking-tight">Zekk</span>
            <span className="text-[28px] font-semibold text-blue-500 tracking-tight">tech</span>
          </div>
          <p className="text-gray-500 text-sm">Masuk ke dashboard admin</p>
        </div>

        {/* Form card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {state?.error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {state.error}
            </div>
          )}

          <form action={formAction} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="admin@zekktech.com"
                className="w-full h-12 px-4 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                className="w-full h-12 px-4 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isPending || state?.success}
              className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm font-semibold transition-all hover:shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? 'Masuk...' : 'Masuk'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-400 mt-6">
          &larr;{' '}
          <a href="/" className="text-blue-500 hover:underline">Kembali ke beranda</a>
        </p>
      </div>
    </main>
  );
}
