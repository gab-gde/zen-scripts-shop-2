'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';

export default function RegisterPage() {
  const router = useRouter();
  const { register, user } = useAuth();
  const [form, setForm] = useState({ email: '', username: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (user) {
    router.push('/dashboard');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (form.password !== form.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (form.password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    setLoading(true);
    try {
      await register(form.email, form.password, form.username);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la création du compte');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12">
      <div className="max-w-md w-full mx-auto px-4">
        <div className="bg-surface rounded-2xl border border-surface-border p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl border border-yellow-500/30">
              ⚡
            </div>
            <h1 className="text-2xl font-bold">Créer un compte</h1>
            <p className="text-gray-400 text-sm mt-2">Rejoignez la communauté ScriptsZeus</p>
          </div>

          <div className="mb-6 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 text-center">
            <span className="text-yellow-400 text-sm font-medium">🎁 100 points offerts à l&apos;inscription !</span>
          </div>

          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Pseudo / Gamertag</label>
              <input
                type="text"
                required
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                placeholder="MonPseudo"
                className="w-full bg-primary border border-surface-border rounded-xl px-4 py-3 focus:border-yellow-500 focus:outline-none transition-colors"
              />
              <p className="text-xs text-gray-500 mt-1">Lettres, chiffres, tirets et underscores</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="votre@email.com"
                className="w-full bg-primary border border-surface-border rounded-xl px-4 py-3 focus:border-yellow-500 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Mot de passe</label>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Minimum 8 caractères"
                className="w-full bg-primary border border-surface-border rounded-xl px-4 py-3 focus:border-yellow-500 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Confirmer le mot de passe</label>
              <input
                type="password"
                required
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                placeholder="••••••••"
                className="w-full bg-primary border border-surface-border rounded-xl px-4 py-3 focus:border-yellow-500 focus:outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-zeus py-3 rounded-xl disabled:opacity-50 transition-all"
            >
              {loading ? 'Création...' : 'Créer mon compte'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Déjà un compte ?{' '}
              <Link href="/login" className="text-yellow-400 hover:underline">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
