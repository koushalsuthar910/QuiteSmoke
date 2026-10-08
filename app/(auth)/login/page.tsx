'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(''); setLoading(true);
    const res = await fetch('/api/auth/login', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) return setError(data.error || 'Login failed');
    router.push(data.onboardingDone ? '/dashboard' : '/onboarding');
    router.refresh();
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2">Welcome back</h1>
      <p className="text-sm text-zinc-500 mb-8">Log in to see your recovery progress.</p>
      <form onSubmit={submit} className="space-y-3">
        <input type="email" required placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
          className="w-full px-4 py-3 rounded-2xl bg-zinc-100 dark:bg-zinc-900 outline-none focus:ring-2 focus:ring-emerald-500" />
        <input type="password" required placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}
          className="w-full px-4 py-3 rounded-2xl bg-zinc-100 dark:bg-zinc-900 outline-none focus:ring-2 focus:ring-emerald-500" />
        {error && <div className="text-sm text-rose-500">{error}</div>}
        <button disabled={loading} className="w-full py-3 rounded-2xl bg-emerald-600 text-white font-semibold disabled:opacity-50">
          {loading ? 'Logging in…' : 'Log in'}
        </button>
      </form>
      <p className="text-sm text-zinc-500 mt-6 text-center">
        New here? <Link href="/signup" className="text-emerald-600 font-medium">Create an account</Link>
      </p>
    </div>
  );
}
