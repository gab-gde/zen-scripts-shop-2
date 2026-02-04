'use client';

import { useState } from 'react';
import Link from 'next/link';
import { sendSupportMessage } from '@/lib/api';

export default function SupportPage() {
  const [formData, setFormData] = useState({
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await sendSupportMessage(formData);
      setSuccess(true);
      setFormData({ email: '', subject: '', message: '' });
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'envoi du message');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-accent/30">
            <svg className="w-10 h-10 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-4">Message envoyé !</h1>
          <p className="text-gray-400 mb-8">
            Nous avons bien reçu votre message et vous répondrons dans les plus brefs délais.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="bg-surface hover:bg-surface-light text-white px-6 py-3 rounded-xl transition-all border border-surface-border"
            >
              Retour à l'accueil
            </Link>
            <button
              onClick={() => setSuccess(false)}
              className="bg-accent hover:bg-accent-dark text-primary font-semibold px-6 py-3 rounded-xl transition-all"
            >
              Envoyer un autre message
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-accent">Support</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Une question ? Un problème ? Nous sommes là pour vous aider.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-3">
            <div className="bg-surface rounded-2xl border border-surface-border p-8">
              <h2 className="text-xl font-semibold mb-6">Envoyez-nous un message</h2>

              {error && (
                <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="votre@email.com"
                    className="w-full bg-primary border border-surface-border rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                    Sujet *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="De quoi s'agit-il ?"
                    className="w-full bg-primary border border-surface-border rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Décrivez votre question ou problème en détail..."
                    className="w-full bg-primary border border-surface-border rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-accent focus:ring-1 focus:ring-accent transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-accent hover:bg-accent-dark text-primary font-bold py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Envoi en cours...
                    </span>
                  ) : (
                    'Envoyer le message'
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Links */}
            <div className="bg-surface rounded-2xl border border-surface-border p-6">
              <h3 className="text-lg font-semibold mb-4">Liens rapides</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/faq" className="flex items-center gap-3 text-gray-400 hover:text-accent transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Consulter la FAQ
                  </Link>
                </li>
                <li>
                  <a href="https://discord.gg/cronuszen" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-400 hover:text-accent transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
                    </svg>
                    Rejoindre Discord
                  </a>
                </li>
                <li>
                  <a href="https://marketplace.cmindapi.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-400 hover:text-accent transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Marketplace Cronus
                  </a>
                </li>
              </ul>
            </div>

            {/* Response Time */}
            <div className="bg-surface rounded-2xl border border-surface-border p-6">
              <h3 className="text-lg font-semibold mb-4">Délai de réponse</h3>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-accent rounded-full animate-pulse" />
                <span className="text-gray-400">Généralement sous 24h</span>
              </div>
              <p className="text-sm text-gray-500 mt-3">
                Pour les urgences, préférez le Discord pour une réponse plus rapide.
              </p>
            </div>

            {/* Tips */}
            <div className="bg-accent/5 rounded-2xl border border-accent/20 p-6">
              <h3 className="text-lg font-semibold mb-3 text-accent">💡 Conseils</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• Incluez votre numéro de commande si applicable</li>
                <li>• Décrivez précisément votre problème</li>
                <li>• Mentionnez votre plateforme (PS5, Xbox...)</li>
                <li>• Vérifiez d'abord la FAQ</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
