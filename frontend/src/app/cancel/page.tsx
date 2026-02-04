import Link from 'next/link';

export default function CancelPage() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12">
      <div className="max-w-md mx-auto px-4 text-center">
        {/* Cancel Icon */}
        <div className="w-20 h-20 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-yellow-500/30">
          <svg className="w-10 h-10 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold mb-4">Paiement annulé</h1>

        <p className="text-gray-400 mb-8">
          Votre paiement a été annulé. Aucun montant n'a été débité de votre compte.
        </p>

        <div className="bg-surface rounded-xl border border-surface-border p-6 mb-8 text-left">
          <h3 className="font-semibold mb-3">Pourquoi cette annulation ?</h3>
          <ul className="text-sm text-gray-400 space-y-2">
            <li>• Vous avez cliqué sur "Annuler" sur la page de paiement</li>
            <li>• La session de paiement a expiré</li>
            <li>• Un problème technique s'est produit</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/scripts"
            className="bg-accent hover:bg-accent-dark text-primary font-semibold px-6 py-3 rounded-xl transition-all"
          >
            Réessayer l'achat
          </Link>
          <Link
            href="/support"
            className="bg-surface hover:bg-surface-light text-white px-6 py-3 rounded-xl transition-all border border-surface-border"
          >
            Besoin d'aide ?
          </Link>
        </div>

        <p className="text-sm text-gray-500 mt-8">
          Si vous rencontrez des problèmes répétés, n'hésitez pas à nous contacter via la page{' '}
          <Link href="/support" className="text-accent hover:underline">Support</Link>.
        </p>
      </div>
    </div>
  );
}
