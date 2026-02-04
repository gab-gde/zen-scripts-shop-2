import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const demoScripts = [
  {
    name: 'FC26 Fast Dribble Pro',
    slug: 'fc26-fast-dribble-pro',
    short_description: 'Dribbles ultra-rapides et feintes automatiques pour EA FC 26. Dominez avec des mouvements fluides et imprévisibles.',
    description: `# FC26 Fast Dribble Pro

## 🎮 Description

Le script ultime pour les dribbleurs sur **EA FC 26**. Exécutez des feintes et des dribbles complexes en un seul bouton, avec des timings parfaits impossibles à atteindre manuellement.

---

## ✨ Fonctionnalités Principales

### ⚡ Fast Dribble Automatique
- **R1/RB intelligent** - Activation contextuelle selon la situation
- **Aucun input lag** - Réactivité instantanée
- **Compatible tous modes** - FUT, Carrière, Pro Clubs

### 🎯 Feintes Rapides
- **Ball Roll** - Gauche/Droite automatique
- **Body Feint** - Déstabilisez les défenseurs
- **Drag Back** - Changements de direction fluides
- **La Croqueta** - Enchaînement parfait

### 🚀 Speed Boost
- **Accélération explosive** - Sortez des situations difficiles
- **Sprint intelligent** - Conserve l'endurance
- **Burst Mode** - Activation sur commande

---

## 📊 Compatibilité

| Plateforme | Support | Notes |
|------------|---------|-------|
| PS5 | ✅ Complet | DualSense optimisé |
| PS4 | ✅ Complet | - |
| Xbox Series X/S | ✅ Complet | - |
| Xbox One | ✅ Complet | - |

---

## ⚙️ Configuration Menu OLED

Accédez au menu avec **LT + Menu** :

1. **Fast Dribble** - ON/OFF
2. **Intensité** - Low / Medium / High
3. **Auto Sprint** - ON/OFF
4. **Profils** - Sauvegardez vos configs

---

## 🎯 Idéal Pour

- Les joueurs offensifs qui aiment dribbler
- Ceux qui veulent humilier leurs adversaires
- Les amateurs de skills et de style
- Les joueurs FUT Weekend League

---

## 📝 Notes de Version

**v2.1** - Février 2026
- ✅ Optimisation pour le patch Title Update 7
- ✅ Nouveau mode "Agile Dribbling"
- ✅ Correction timing Ball Roll
- ✅ Amélioration stabilité

**v2.0** - Janvier 2026
- Refonte complète du système de dribble
- Ajout du Speed Boost
- Nouveau menu OLED

---

*Compatible avec tous les modes de jeu. Mises à jour gratuites incluses.*`,
    price_cents: 1999,
    currency: 'EUR',
    images: [
      'https://images.unsplash.com/photo-1493711662062-fa541f7f3d24?w=800&h=600&fit=crop',
    ],
    video_url: null,
    is_active: true,
  },
  {
    name: 'Green-Time Finish Master',
    slug: 'green-time-finish-master',
    short_description: 'Timing parfait automatique pour tirs, passes et centres. Ne ratez plus jamais une occasion de marquer.',
    description: `# Green-Time Finish Master

## 🎮 Description

Atteignez la **perfection** avec des timings automatiques pour tous vos tirs, passes et centres. Le script analyse le contexte et applique le **timing vert optimal** en temps réel.

---

## ✨ Fonctionnalités

### 🎯 Perfect Shot System

| Type de Tir | Taux Green | Notes |
|-------------|------------|-------|
| Tir normal | 85%+ | Toutes situations |
| Low Driven | 90%+ | Optimisé |
| Finesse | 85%+ | Extérieur surface |
| Power Shot | 80%+ | Timing adapté |
| Tête | 75%+ | Position variable |

### 📤 Perfect Pass

- **Passes courtes** - 95% précision
- **Passes longues** - 90% précision
- **Through balls** - 88% précision
- **Lobbed passes** - 85% précision

### ⚽ Perfect Cross

- **Centres classiques** - Timing parfait
- **Centres en retrait** - Adaptation auto
- **Early cross** - Optimisé pour contre-attaques

---

## 🔧 Comment ça marche ?

Le script détecte automatiquement :

1. **Type d'action** (tir, passe, centre)
2. **Position du joueur**
3. **Distance au but**
4. **Pression défensive**

Et applique le timing optimal en **<10ms**.

---

## ⚙️ Configuration

Tout est ajustable via le **menu OLED** (LT + Menu) :

\`\`\`
┌─ GREEN-TIME MASTER ─────────┐
│                              │
│  Perfect Shot    [ON]        │
│  Perfect Pass    [ON]        │
│  Perfect Cross   [ON]        │
│                              │
│  Timing Offset   [0ms]       │
│  Lag Compensation [AUTO]     │
│                              │
│  Profile: [BALANCED]         │
│                              │
└──────────────────────────────┘
\`\`\`

### Profils Prédéfinis

- **AGGRESSIVE** - Tirs puissants privilégiés
- **BALANCED** - Configuration optimale
- **SAFE** - Passes sécurisées

---

## 📊 Statistiques Réelles

*Basé sur 10,000+ tirs testés en conditions réelles*

- **Taux de green global** : 83%
- **Buts par match** : +1.2 en moyenne
- **Assists par match** : +0.8 en moyenne

---

## 🎮 Compatible

✅ FUT Champions  
✅ Division Rivals  
✅ Squad Battles  
✅ Carrière  
✅ Pro Clubs  

---

## 📝 Changelog

**v3.0** - Février 2026
- Refonte algorithme de timing
- Support Power Shot amélioré
- Compensation lag automatique

---

*Le script le plus vendu pour EA FC 26 - Plus de 2000 utilisateurs satisfaits*`,
    price_cents: 2499,
    currency: 'EUR',
    images: [
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=600&fit=crop',
    ],
    video_url: null,
    is_active: true,
  },
  {
    name: 'Auto-Skill Moves Ultimate',
    slug: 'auto-skill-moves-ultimate',
    short_description: '76 skill moves exécutables en un clic. Du ball roll à l\'elastico, maîtrisez tous les gestes techniques instantanément.',
    description: `# Auto-Skill Moves Ultimate

## 🎮 Description

Le **pack complet** de skill moves pour EA FC 26. **76 gestes techniques** assignables aux directions du D-PAD ou aux combinaisons de boutons.

---

## ⭐ Liste Complète des Skills

### ⭐ 1-Star Skills (12)
- Ball Roll (L/R)
- Fake Pass
- Drag Back
- Stop and Turn
- Directional Touch
- Shield Jockey
- *+ 6 autres...*

### ⭐⭐ 2-Star Skills (14)
- Body Feint (L/R)
- Stepover (L/R)
- Ball Juggle
- Reverse Stepover
- Feint Forward Turn
- *+ 9 autres...*

### ⭐⭐⭐ 3-Star Skills (16)
- Heel Flick
- Roulette
- Fake Shot Stop
- Lane Change
- Heel to Heel Flick
- Ball Roll Cut
- *+ 10 autres...*

### ⭐⭐⭐⭐ 4-Star Skills (18)
- Elastico (Flip Flap)
- Spin Move (L/R)
- Ball Roll Cut
- Heel to Heel
- Scoop Turn
- Stop and Turn
- La Croqueta
- Drag to Heel
- *+ 10 autres...*

### ⭐⭐⭐⭐⭐ 5-Star Skills (16)
- Elastico Chop
- Rabona Fake
- Sombrero Flick
- Rainbow Flick
- Bolasie Flick
- Tornado Spin
- Waka Waka
- El Tornado
- *+ 8 autres...*

---

## 🎮 Configuration D-PAD

Assignez **n'importe quel skill** à :

| Input | Assignation |
|-------|-------------|
| D-PAD ↑ | Skill au choix |
| D-PAD ↓ | Skill au choix |
| D-PAD ← | Skill au choix |
| D-PAD → | Skill au choix |

### Flex Combos (9 slots)

| Combo | Assignation |
|-------|-------------|
| L2 + ↑ | Skill au choix |
| L2 + ↓ | Skill au choix |
| L2 + ← | Skill au choix |
| L2 + → | Skill au choix |
| R2 + ↑ | Skill au choix |
| *...et plus* | |

---

## ⚙️ Menu OLED Complet

\`\`\`
┌─ SKILL MOVES ULTIMATE ──────┐
│                              │
│  Category: [5-STAR]          │
│                              │
│  D-PAD UP:    [Elastico]     │
│  D-PAD DOWN:  [Roulette]     │
│  D-PAD LEFT:  [La Croqueta]  │
│  D-PAD RIGHT: [Rainbow]      │
│                              │
│  [FLEX COMBOS >]             │
│  [PRESETS >]                 │
│  [SAVE PROFILE]              │
│                              │
└──────────────────────────────┘
\`\`\`

---

## 💡 Conseils Pro

1. **Commencez simple** - Ball Roll, Body Feint
2. **Progressez** - Ajoutez Elastico, Roulette
3. **Combinez** - Utilisez les Flex Combos en match
4. **Adaptez** - Créez des profils selon vos ailiers

---

## 📦 Ce qui est inclus

- ✅ 76 skills moves programmés
- ✅ 9 Flex combos personnalisables
- ✅ Menu OLED complet
- ✅ 5 profils prédéfinis
- ✅ Guide PDF détaillé (23 pages)
- ✅ Mises à jour gratuites à vie

---

## 📊 Compatibilité

| Plateforme | Support |
|------------|---------|
| PS5 | ✅ |
| PS4 | ✅ |
| Xbox Series | ✅ |
| Xbox One | ✅ |

---

## 📝 Changelog

**v4.0** - Février 2026
- Ajout des nouveaux skills FC26
- Refonte menu OLED
- Temps de réponse optimisé (<8ms)
- Correction El Tornado timing

---

*Le script le plus complet pour les skill moves - Recommandé par les pros*`,
    price_cents: 2999,
    currency: 'EUR',
    images: [
      'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800&h=600&fit=crop',
    ],
    video_url: null,
    is_active: true,
  },
];

async function seed() {
  console.log('');
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║            ZEN SCRIPTS SHOP - DATABASE SEED                  ║');
  console.log('╚══════════════════════════════════════════════════════════════╝');
  console.log('');

  // Check connection
  console.log('🔌 Connecting to Supabase...');
  const { data: testData, error: testError } = await supabase.from('scripts').select('count').limit(1);
  
  if (testError && !testError.message.includes('0 rows')) {
    console.error('❌ Connection failed:', testError.message);
    console.log('');
    console.log('💡 Make sure you have:');
    console.log('   1. Created the tables using supabase.sql');
    console.log('   2. Set the correct SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }
  console.log('✅ Connected to Supabase');
  console.log('');

  // Clear existing scripts
  console.log('🗑️  Clearing existing demo scripts...');
  for (const script of demoScripts) {
    await supabase.from('scripts').delete().eq('slug', script.slug);
  }

  // Insert demo scripts
  console.log('📝 Inserting demo scripts...');
  console.log('');

  for (const script of demoScripts) {
    const { data, error } = await supabase
      .from('scripts')
      .insert(script)
      .select('id, name, slug, price_cents, currency')
      .single();

    if (error) {
      console.error(`   ❌ Failed: "${script.name}"`);
      console.error(`      Error: ${error.message}`);
    } else {
      const price = (script.price_cents / 100).toFixed(2);
      console.log(`   ✅ ${script.name}`);
      console.log(`      Slug: ${script.slug}`);
      console.log(`      Price: €${price}`);
      console.log(`      ID: ${data.id}`);
      console.log('');
    }
  }

  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');
  console.log('🎉 Seed completed successfully!');
  console.log('');
  console.log('📋 Next steps:');
  console.log('   1. Start the backend: npm run dev');
  console.log('   2. Start the frontend: npm run dev');
  console.log('   3. Visit http://localhost:3000/scripts');
  console.log('');
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('');
    console.error('❌ Seed failed with error:', error);
    process.exit(1);
  });
