import Link from 'next/link';

export default function CancelPage() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12">
      <div className="max-w-md mx-auto px-4 text-center">
        <div className="w-20 h-20 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl border border-orange-500/30">
          ⚠️
        </div>
        <h1 className="text-3xl font-bold mb-4">Paiement annulé</h1>
        <p className="text-gray-400 mb-8">Aucun montant n'a été débité de votre compte.</p>
        <div className="flex flex-col gap-4">
          <Link href="/scripts" className="btn-zeus px-6 py-3 rounded-xl">
            Réessayer l'achat
          </Link>
          <Link href="/support" className="text-gray-400 hover:text-yellow-400 transition-colors">
            Besoin d'aide ?
          </Link>
        </div>
      </div>
    </div>
  );
}
