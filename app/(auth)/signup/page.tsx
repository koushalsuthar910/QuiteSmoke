'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (password !== confirm) return setError('Passwords do not match');
    setLoading(true);
    const res = await fetch('/api/auth/signup', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) return setError(data.error || 'Signup failed');
    router.push('/onboarding');
    router.refresh();
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2">Start your journey</h1>
      <p className="text-sm text-zinc-500 mb-8">Create an account to track your recovery.</p>
      <form onSubmit={submit} className="space-y-3">
        <input type="email" required placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
          className="w-full px-4 py-3 rounded-2xl bg-zinc-100 dark:bg-zinc-900 outline-none focus:ring-2 focus:ring-emerald-500" />
        <input type="password" required minLength={6} placeholder="Password (min 6 chars)" value={password} onChange={e => setPassword(e.target.value)}
          className="w-full px-4 py-3 rounded-2xl bg-zinc-100 dark:bg-zinc-900 outline-none focus:ring-2 focus:ring-emerald-500" />
        <input type="password" required placeholder="Confirm password" value={confirm} onChange={e => setConfirm(e.target.value)}
          className="w-full px-4 py-3 rounded-2xl bg-zinc-100 dark:bg-zinc-900 outline-none focus:ring-2 focus:ring-emerald-500" />
        {error && <div className="text-sm text-rose-500">{error}</div>}
        <button disabled={loading} className="w-full py-3 rounded-2xl bg-emerald-600 text-white font-semibold disabled:opacity-50">
          {loading ? 'Creating…' : 'Create account'}
        </button>
      </form>
      <p className="text-sm text-zinc-500 mt-6 text-center">
        Already have an account? <Link href="/login" className="text-emerald-600 font-medium">Log in</Link>
      </p>
    </div>
  );
}
