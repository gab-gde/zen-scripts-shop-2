'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getScripts } from '@/lib/api';

interface Script {
  id: string;
  name: string;
  slug: string;
  short_description: string;
  price_cents: number;
  images: string[];
}

export default function ScriptsPage() {
  const [scripts, setScripts] = useState<Script[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getScripts()
      .then(setScripts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Nos <span className="text-yellow-400">Scripts</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Chaque script est optimisé pour la dernière version du jeu et livré sous forme de build unique chiffré à votre nom.
          </p>
        </div>

        {loading ? (
          <div className="text-center text-gray-400 py-20">Chargement...</div>
        ) : scripts.length === 0 ? (
          <div className="text-center text-gray-400 py-20">Aucun script disponible pour le moment.</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scripts.map((script) => (
              <Link 
                key={script.id}
                href={`/scripts/${script.slug}`}
                className="group bg-surface rounded-2xl border border-surface-border hover:border-yellow-500/50 transition-all overflow-hidden"
              >
                {script.images && script.images[0] && (
                  <div className="aspect-video overflow-hidden">
                    <img 
                      src={script.images[0]} 
                      alt={script.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-yellow-400 transition-colors">
                    {script.name}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">{script.short_description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-yellow-400">
                      {(script.price_cents / 100).toFixed(2)} €
                    </span>
                    <span className="text-gray-500 text-sm group-hover:text-yellow-400 transition-colors">
                      Voir détails →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Info box - CHANGÉ: Plus de Marketplace */}
        <div className="mt-16 bg-surface rounded-2xl border border-surface-border p-8 text-center">
          <h2 className="text-xl font-bold mb-3">🔐 Livraison sécurisée par chiffrement</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Après achat, rejoignez notre Discord et fournissez votre pseudo. 
            Nous générons un script unique chiffré à votre nom avec hash, sel et watermarks. 
            Livraison sous 24h.
          </p>
          <Link href="/faq" className="text-yellow-400 hover:underline font-medium mt-4 inline-block">
            Voir la FAQ complète →
          </Link>
        </div>
      </div>
    </div>
  );
}
