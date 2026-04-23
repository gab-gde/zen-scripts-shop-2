'use client';
import { useState } from 'react';
import Link from 'next/link';
import { sendSupportMessage } from '@/lib/api';
import AutoplayMusic from '@/components/AutoplayMusic';

export default function SupportPage() {
  const [form, setForm] = useState({ email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError(null);
    try { await sendSupportMessage(form); setSuccess(true); setForm({ email: '', subject: '', message: '' }); }
    catch (err: any) { setError(err.message || 'Erreur'); }
    finally { setLoading(false); }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 relative">
        <div className="fixed inset-0 pointer-events-none -z-10">
          <div className="absolute inset-0 bg-[#0a0a08]" />
          <div className="absolute inset-0 theme-rust" />
        </div>
        <div className="text-center">
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl border border-green-500/30">✓</div>
          <h1 className="text-3xl font-bold mb-4">Message envoyé !</h1>
          <p className="text-gray-400 mb-8">Nous vous répondrons sous 24h.</p>
          <button onClick={() => setSuccess(false)} className="btn-zeus px-6 py-3 rounded-xl">Envoyer un autre message</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute inset-0 bg-[#0a0a08]" />
        <div className="absolute inset-0 theme-rust" />
        <div className="absolute inset-0">
          <img src="/images/rust.jpg" alt="" className="w-full h-full object-cover opacity-15" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a08]/30 via-[#0a0a08]/60 to-[#0a0a08]/95" />
        </div>
      </div>
      <AutoplayMusic youtubeId="DeCnsghKxd4" label="Rust Theme" />

      <div className="py-12 relative z-10">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-2 mb-6">
              <span className="text-amber-400">💬</span>
              <span className="text-sm text-amber-400 font-medium">Assistance</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-orange-500">Support</span>
            </h1>
            <p className="text-gray-400">Une question ? Un problème ? Nous sommes là pour vous aider.</p>
          </div>

          <div className="glass rounded-2xl p-8">
            {error && <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Email *</label>
                <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full glass rounded-xl px-4 py-3 focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/30 focus:outline-none transition-all text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Sujet *</label>
                <input type="text" required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full glass rounded-xl px-4 py-3 focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/30 focus:outline-none transition-all text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Message *</label>
                <textarea required rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full glass rounded-xl px-4 py-3 resize-none focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/30 focus:outline-none transition-all text-white" />
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-bold py-4 rounded-xl disabled:opacity-50 transition-all hover:shadow-[0_0_25px_rgba(245,158,11,0.3)]">
                {loading ? 'Envoi...' : 'Envoyer le message'}
              </button>
            </form>
          </div>

          <div className="mt-8 text-center text-gray-400 text-sm">
            <p>Consultez aussi notre <Link href="/faq" className="text-amber-400 hover:underline">FAQ</Link> pour des réponses rapides.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
