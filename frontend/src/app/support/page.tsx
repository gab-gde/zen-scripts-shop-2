'use client';

import { useState } from 'react';
import Link from 'next/link';
import { sendSupportMessage } from '@/lib/api';

export default function SupportPage() {
  const [form, setForm] = useState({ email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await sendSupportMessage(form);
      setSuccess(true);
      setForm({ email: '', subject: '', message: '' });
    } catch (err: any) {
      setError(err.message || 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-20 h-20 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl border border-yellow-500/30">✓</div>
          <h1 className="text-3xl font-bold mb-4">Message envoyé !</h1>
          <p className="text-gray-400 mb-8">Nous vous répondrons sous 24h.</p>
          <button onClick={() => setSuccess(false)} className="btn-zeus px-6 py-3 rounded-xl">
            Envoyer un autre message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4"><span className="text-yellow-400">Support</span></h1>
          <p className="text-gray-400">Une question ? Un problème ? Nous sommes là pour vous aider.</p>
        </div>

        <div className="bg-surface rounded-2xl border border-surface-border p-8">
          {error && <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400">{error}</div>}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Email *</label>
              <input 
                type="email" 
                required 
                value={form.email} 
                onChange={(e) => setForm({ ...form, email: e.target.value })} 
                className="w-full bg-primary border border-surface-border rounded-xl px-4 py-3 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Sujet *</label>
              <input 
                type="text" 
                required 
                value={form.subject} 
                onChange={(e) => setForm({ ...form, subject: e.target.value })} 
                className="w-full bg-primary border border-surface-border rounded-xl px-4 py-3 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Message *</label>
              <textarea 
                required 
                rows={6} 
                value={form.message} 
                onChange={(e) => setForm({ ...form, message: e.target.value })} 
                className="w-full bg-primary border border-surface-border rounded-xl px-4 py-3 resize-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all" 
              />
            </div>
            <button type="submit" disabled={loading} className="w-full btn-zeus py-4 rounded-xl disabled:opacity-50">
              {loading ? 'Envoi...' : 'Envoyer le message'}
            </button>
          </form>
        </div>

        <div className="mt-8 text-center text-gray-400 text-sm">
          <p>Vous pouvez aussi consulter notre <Link href="/faq" className="text-yellow-400 hover:underline">FAQ</Link> pour des réponses rapides.</p>
        </div>
      </div>
    </div>
  );
}
