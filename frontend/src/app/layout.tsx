import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/components/AuthProvider';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Scripts Zeus - Scripts Cronus Zen Premium',
  description: 'Scripts professionnels Cronus Zen pour tous vos jeux. EA FC, R6, Rocket League et plus. Performance maximale garantie.',
  keywords: 'cronus zen, scripts, ea fc, rainbow six, rocket league, gaming, aim assist',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="dark">
      <body className="bg-primary text-white min-h-screen flex flex-col">
        <AuthProvider>
          <Header />
          <main className="flex-1 pt-16">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
