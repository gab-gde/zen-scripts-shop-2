'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

function NexusSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!sessionId) {
      setError('Session invalide.');
      setLoading(false);
      return;
    }

    fetch(`${API_URL}/api/nexus/download/${sessionId}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setData(d);
        } else {
          setError('Session non trouvée ou expirée.');
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Erreur réseau.');
        setLoading(false);
      });
  }, [sessionId]);

  function copyKey() {
    if (data?.license_key) {
      navigator.clipboard.writeText(data.license_key);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  if (loading) {
    return (
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-400">Vérification de votre commande...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-red-400 text-2xl">✗</span>
        </div>
        <h1 className="text-xl font-bold text-white mb-2">Erreur</h1>
        <p className="text-gray-400 mb-6">{error}</p>
        <Link href="/nexus" className="text-yellow-400 hover:underline">
          ← Retour à la page NEXUS
        </Link>
      </div>
    );
  }

  const tierColor = data.tier === 'Lifetime' ? 'text-red-400 border-red-500/30 bg-red-500/10' :
                    data.tier === 'Pro' ? 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10' :
                    'text-cyan-400 border-cyan-500/30 bg-cyan-500/10';

  return (
    <div className="bg-surface border border-surface-border rounded-2xl p-8 text-center">
      <div className="w-16 h-16 bg-green-500/10 border-2 border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-5">
        <span className="text-green-400 text-3xl">✓</span>
      </div>

      <h1 className="text-2xl font-bold text-white mb-1">NEXUS est à vous !</h1>
      <p className="text-gray-500 text-sm mb-2">
        Merci{data.pseudo ? ` ${data.pseudo}` : ''} !
      </p>
      <div className={`inline-block px-3 py-1 rounded-full border text-xs font-bold tracking-wider mb-6 ${tierColor}`}>
        {data.tier?.toUpperCase()}
      </div>

      {/* License key */}
      {data.license_key && data.license_key !== 'CONTACT-SUPPORT' && (
        <div className="bg-primary-light border border-surface-border rounded-xl p-5 mb-6">
          <p className="text-gray-500 text-xs uppercase tracking-widest mb-3">Votre clé de licence</p>
          <div
            onClick={copyKey}
            className="bg-primary rounded-lg p-4 border border-surface-border cursor-pointer hover:border-yellow-500/30 transition-all group"
          >
            <code className="text-yellow-400 text-lg font-bold tracking-wider font-mono">
              {data.license_key}
            </code>
            <p className="text-gray-600 text-[10px] mt-2 group-hover:text-gray-400 transition-colors">
              {copied ? '✓ Copié !' : 'Cliquez pour copier'}
            </p>
          </div>
          <p className="text-green-400/70 text-xs mt-3">
            📧 Cette clé a aussi été envoyée à <strong>{data.email}</strong>
          </p>
        </div>
      )}

      {/* Download buttons */}
      <div className="space-y-3 mb-6">
        <a
          href={data.exe_url}
          className="flex items-center justify-center gap-3 w-full bg-red-500 hover:bg-red-600 text-white font-bold py-4 rounded-xl transition-all hover:shadow-[0_0_20px_rgba(255,62,62,0.3)]"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Télécharger NEXUS.exe
        </a>
        <a
          href={data.pdf_url}
          className="flex items-center justify-center gap-3 w-full bg-surface border border-surface-border hover:border-yellow-500/30 text-gray-300 hover:text-white font-medium py-3.5 rounded-xl transition-all"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Documentation PDF
        </a>
      </div>

      {/* Shortcuts */}
      <div className="bg-primary-light rounded-xl p-4 text-left text-sm mb-6 border border-surface-border">
        <p className="text-gray-400">
          <span className="text-yellow-400 font-semibold">Raccourcis :</span> INSERT pour toggle le menu, ESC pour quitter.
        </p>
      </div>

      <Link href="/nexus" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
        ← Retour à la page NEXUS
      </Link>
    </div>
  );
}

export default function NexusSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-lg w-full">
        <Suspense
          fallback={
            <div className="text-center">
              <div className="w-12 h-12 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-400">Chargement...</p>
            </div>
          }
        >
          <NexusSuccessContent />
        </Suspense>
      </div>
    </div>
  );
}
