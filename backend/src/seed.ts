// seed.ts - Données de démonstration
// ← CHANGÉ: NBA 2K25 → NBA 2K26

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const scripts = [
  {
    name: 'EA FC 26 Pro',
    slug: 'ea-fc-26-pro',
    short_description: 'Script complet pour EA FC 26 - Perfect Shot, Skill Moves, Speed Boost',
    description: `# EA FC 26 Pro - Zeus Premium

## Fonctionnalités
- **Perfect Shot** : Timing automatique pour tirs parfaits
- **Perfect Pass** : Passes précises à chaque fois
- **76 Skill Moves** : Tous les gestes techniques en un clic
- **Speed Boost** : Sprint continu optimisé
- **Drop Shot** : Tirs en finesse automatiques
- **Menu OLED** : Configuration complète sur le Cronus Zen

## Optimisé pour FC 26
Script entièrement recodé pour les mécaniques de FC 26 (timings, moteur HyperMotion V, etc.)

## Protection
Build unique chiffré à votre nom. Partage impossible et détectable.
`,
    price_cents: 2000,
    currency: 'EUR',
    images: ['https://images.unsplash.com/photo-1493711662062-fa541f7f3d24?w=800'],
    active: true,
  },
  {
    name: 'Rainbow Six Siege',
    slug: 'rainbow-six-siege',
    short_description: 'Anti-recoil précis pour toutes les armes R6',
    description: `# Rainbow Six Siege - Zeus Premium

## Fonctionnalités
- **Anti-Recoil** : Pattern par arme avec compensation automatique
- **Rapid Fire** : Tir rapide configurable
- **Quick Lean** : Lean toggle amélioré
- **Menu OLED** : Sélection d'arme et réglages en jeu

## Optimisé pour la dernière saison
Patterns mis à jour pour chaque arme.
`,
    price_cents: 2000,
    currency: 'EUR',
    images: ['https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800'],
    active: true,
  },
  {
    // ← CHANGÉ: 2K25 → 2K26 partout
    name: 'NBA 2K26',
    slug: 'nba-2k26',
    short_description: 'Shooting, dribbles et défense automatisés pour NBA 2K26',
    description: `# NBA 2K26 - Zeus Premium

## Fonctionnalités
- **Green-Time Shooting** : Tempo optimisé pour le système Green-or-Miss de 2K26
- **Dribbles Meta** : Momentum Cross, Snatchback, Escape Combo, BTB Burst
- **No-Dip** : Catch-and-shoot natif recalibré
- **Speed Boost** : Activation automatique en dribble
- **Quick Protect** : Protection automatique du ballon
- **Menu OLED** : Menu de configuration simplifié

## Optimisé pour NBA 2K26 Patch 2.0
Fenêtres vertes recalibrées, dribbles meta complets, timing adapté au moteur ProPLAY.
`,
    price_cents: 2000,
    currency: 'EUR',
    images: ['https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800'],
    active: true,
  },
  {
    name: 'PUBG',
    slug: 'pubg',
    short_description: 'Anti-recoil et rapid fire pour PUBG',
    description: `# PUBG - Zeus Premium

## Fonctionnalités
- **Anti-Recoil** : Patterns optimisés par arme
- **Rapid Fire** : Configurable par type d'arme
- **Quick Scope** : ADS rapide
- **Menu OLED** complet

Optimisé pour la dernière version de PUBG Console.
`,
    price_cents: 2000,
    currency: 'EUR',
    images: ['https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800'],
    active: true,
  },
  {
    name: 'Rocket League',
    slug: 'rocket-league',
    short_description: 'Speedflips, aerial tricks et méchaniques avancées',
    description: `# Rocket League - Zeus Premium

## Fonctionnalités
- **Speedflip** : Front, Diagonal et Back
- **Aerial Tricks** : Tornado Spin, Musty Flick, Stall
- **Wavedash / Walldash** automatiques
- **8 Power Buttons** configurables
- **Menu OLED** complet

Timings optimisés pour la dernière version de Rocket League.
`,
    price_cents: 2000,
    currency: 'EUR',
    images: ['https://images.unsplash.com/photo-1614465000772-1b302f031520?w=800'],
    active: true,
  },
  {
    name: 'Call of Duty BO6',
    slug: 'call-of-duty-bo6',
    short_description: 'Anti-recoil et aim assist pour Black Ops 6',
    description: `# Call of Duty BO6 - Zeus Premium

## Fonctionnalités
- **Anti-Recoil** : Patterns par arme
- **Aim Assist** : 3 modes (Circulaire, Linéaire, Polaire)
- **Rapid Fire** et **Drop Shot**
- **Menu OLED** complet

Optimisé pour Black Ops 6.
`,
    price_cents: 2000,
    currency: 'EUR',
    images: ['https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800'],
    active: true,
  },
  {
    name: 'DayZ',
    slug: 'dayz',
    short_description: 'Anti-recoil, quick actions et survival mods pour DayZ',
    description: `# DayZ - Zeus Premium

## Fonctionnalités
- **Anti-Recoil** : Vertical + Horizontal avec lissage
- **Quick Actions** : Bandage, Eat, Drink, Reload rapides
- **Rapid Fire** et **Hair Trigger**
- **Lean Toggle** intelligent
- **Menu OLED** 5 catégories, 28 mods

Optimisé pour la dernière version de DayZ Console.
`,
    price_cents: 2000,
    currency: 'EUR',
    images: ['https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800'],
    active: true,
  },
  {
    name: 'Rust',
    slug: 'rust',
    short_description: 'Anti-recoil 22 armes et strafe assist pour Rust Console',
    description: `# Rust - Zeus Premium

## Fonctionnalités
- **Anti-Recoil** : 22 patterns d'armes optimisés
- **Rapid Fire** configurable
- **Strafe Assist** automatique
- **Anti-Détection** : Jitter randomisé
- **Menu OLED** avec sélection d'arme

Optimisé pour Rust Console Edition 2025-2026.
`,
    price_cents: 2000,
    currency: 'EUR',
    images: ['https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800'],
    active: true,
  },
];

async function seed() {
  console.log('🌱 Seeding scripts...');

  for (const script of scripts) {
    const { error } = await supabase
      .from('scripts')
      .upsert(script, { onConflict: 'slug' });

    if (error) {
      console.error(`❌ Erreur pour ${script.name}:`, error);
    } else {
      console.log(`✅ ${script.name}`);
    }
  }

  console.log('🎉 Seed terminé !');
}

seed();
