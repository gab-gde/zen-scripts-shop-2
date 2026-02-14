'use client';

import { useState } from 'react';
import { authUpdateProfile, authChangePassword } from '@/lib/api';
import { useAuth } from '@/components/AuthProvider';

export default function SettingsPage() {
  const { user, refreshUser } = useAuth();
  const [username, setUsername] = useState(user?.username || '');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMessage, setProfileMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [pwLoading, setPwLoading] = useState(false);
  const [pwMessage, setPwMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  async function handleProfileUpdate(e: React.FormEvent) {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMessage(null);
    try {
      await authUpdateProfile({ username });
      await refreshUser();
      setProfileMessage({ type: 'success', text: 'Profil mis à jour !' });
    } catch (err: any) {
      setProfileMessage({ type: 'error', text: err.message || 'Erreur' });
    }
    setProfileLoading(false);
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setPwMessage(null);

    if (passwords.new !== passwords.confirm) {
      setPwMessage({ type: 'error', text: 'Les mots de passe ne correspondent pas' });
      return;
    }

    if (passwords.new.length < 8) {
      setPwMessage({ type: 'error', text: 'Le nouveau mot de passe doit contenir au moins 8 caractères' });
      return;
    }

    setPwLoading(true);
    try {
      await authChangePassword({ currentPassword: passwords.current, newPassword: passwords.new });
      setPwMessage({ type: 'success', text: 'Mot de passe mis à jour !' });
      setPasswords({ current: '', new: '', confirm: '' });
    } catch (err: any) {
      setPwMessage({ type: 'error', text: err.message || 'Erreur' });
    }
    setPwLoading(false);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Paramètres</h1>

      {/* Profile */}
      <div className="bg-surface rounded-2xl border border-surface-border p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Profil</h2>

        {profileMessage && (
          <div className={`mb-4 rounded-xl p-3 text-sm ${
            profileMessage.type === 'success'
              ? 'bg-green-500/10 border border-green-500/30 text-green-400'
              : 'bg-red-500/10 border border-red-500/30 text-red-400'
          }`}>
            {profileMessage.text}
          </div>
        )}

        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Email</label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full bg-primary border border-surface-border rounded-xl px-4 py-3 text-gray-500 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">L&apos;email ne peut pas être modifié</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Pseudo</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-primary border border-surface-border rounded-xl px-4 py-3 focus:border-yellow-500 focus:outline-none transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={profileLoading}
            className="btn-zeus px-6 py-2.5 rounded-xl text-sm disabled:opacity-50"
          >
            {profileLoading ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </form>
      </div>

      {/* Password */}
      <div className="bg-surface rounded-2xl border border-surface-border p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Changer le mot de passe</h2>

        {pwMessage && (
          <div className={`mb-4 rounded-xl p-3 text-sm ${
            pwMessage.type === 'success'
              ? 'bg-green-500/10 border border-green-500/30 text-green-400'
              : 'bg-red-500/10 border border-red-500/30 text-red-400'
          }`}>
            {pwMessage.text}
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Mot de passe actuel</label>
            <input
              type="password"
              required
              value={passwords.current}
              onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
              className="w-full bg-primary border border-surface-border rounded-xl px-4 py-3 focus:border-yellow-500 focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Nouveau mot de passe</label>
            <input
              type="password"
              required
              value={passwords.new}
              onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
              className="w-full bg-primary border border-surface-border rounded-xl px-4 py-3 focus:border-yellow-500 focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Confirmer</label>
            <input
              type="password"
              required
              value={passwords.confirm}
              onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
              className="w-full bg-primary border border-surface-border rounded-xl px-4 py-3 focus:border-yellow-500 focus:outline-none transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={pwLoading}
            className="btn-zeus px-6 py-2.5 rounded-xl text-sm disabled:opacity-50"
          >
            {pwLoading ? 'Modification...' : 'Changer le mot de passe'}
          </button>
        </form>
      </div>

      {/* Account info */}
      <div className="bg-surface rounded-2xl border border-surface-border p-6">
        <h2 className="text-lg font-semibold mb-4">Informations du compte</h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Membre depuis</span>
            <span>{user?.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR') : '-'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Points</span>
            <span className="text-yellow-400 font-bold">{user?.points_balance || 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Abonnement</span>
            <span>{user?.is_subscribed ? `${user.subscription_tier?.toUpperCase()} ⚡` : 'Aucun'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
