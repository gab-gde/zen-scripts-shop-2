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
    short_description: 'Dribbles ultra-rapides et feintes automatiques pour EA FC 26. Dominez avec des mouvements fluides.',
    description: `# FC26 Fast Dribble Pro

## 🎮 Description
Le script ultime pour les dribbleurs sur **EA FC 26**. Exécutez des feintes et dribbles complexes en un seul bouton.

## ✨ Fonctionnalités
- **Fast Dribble automatique** - R1/RB intelligent
- **Feintes rapides** - Ball roll, body feint, drag back
- **Speed Boost** - Accélération explosive
- **Menu OLED complet**

## 📊 Compatibilité
| Plateforme | Support |
|------------|---------|
| PS5 | ✅ |
| PS4 | ✅ |
| Xbox Series | ✅ |
| Xbox One | ✅ |

## 📝 v2.1 - Février 2026
- Optimisation patch 1.14
- Nouveau mode "Agile Dribbling"`,
    price_cents: 1999,
    currency: 'EUR',
    images: ['https://images.unsplash.com/photo-1493711662062-fa541f7f3d24?w=800&h=600&fit=crop'],
    video_url: null,
    is_active: true,
  },
  {
    name: 'Green-Time Finish Master',
    slug: 'green-time-finish-master',
    short_description: 'Timing parfait automatique pour tirs, passes et centres. 85%+ de green timing garanti.',
    description: `# Green-Time Finish Master

## 🎮 Description
Atteignez la **perfection** avec des timings automatiques pour tirs, passes et centres.

## ✨ Fonctionnalités
### 🎯 Perfect Shot - 85%+ green
- Tir normal, Low Driven, Finesse, Power Shot

### 📤 Perfect Pass - 90%+ précision
- Passes courtes, longues, through balls

### ⚽ Perfect Cross
- Centres parfaitement timés

## ⚙️ Menu OLED
- Perfect Shot ON/OFF
- Perfect Pass ON/OFF
- Timing Offset réglable
- Profils sauvegardés

## 📝 v3.0 - Février 2026
- Refonte algorithme timing
- Compensation lag auto`,
    price_cents: 2499,
    currency: 'EUR',
    images: ['https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=600&fit=crop'],
    video_url: null,
    is_active: true,
  },
  {
    name: 'Auto-Skill Moves Ultimate',
    slug: 'auto-skill-moves-ultimate',
    short_description: '76 skill moves en un clic. Du ball roll à l\'elastico, maîtrisez tous les gestes techniques.',
    description: `# Auto-Skill Moves Ultimate

## 🎮 Description
**76 gestes techniques** assignables au D-PAD ou combinaisons de boutons.

## ⭐ Skills inclus
### 1-Star (12 skills)
Ball Roll, Fake Pass, Drag Back...

### 2-Star (14 skills)
Body Feint, Stepover, Ball Juggle...

### 3-Star (16 skills)
Heel Flick, Roulette, Fake Shot...

### 4-Star (18 skills)
Elastico, Spin Move, La Croqueta...

### 5-Star (16 skills)
Rainbow, Bolasie Flick, El Tornado...

## 🎮 Configuration
- D-PAD ↑↓←→ : 4 skills assignables
- Flex Combos L2/R2 + direction
- 5 profils sauvegardables

## 📦 Inclus
- 76 skills programmés
- 9 Flex combos
- Menu OLED complet
- Guide PDF

## 📝 v4.0 - Février 2026
- Nouveaux skills FC26
- Temps réponse <8ms`,
    price_cents: 2999,
    currency: 'EUR',
    images: ['https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800&h=600&fit=crop'],
    video_url: null,
    is_active: true,
  },
];

async function seed() {
  console.log('');
  console.log('🌱 ZEN SCRIPTS SHOP - DATABASE SEED');
  console.log('====================================');
  console.log('');

  // Test connection
  console.log('🔌 Testing Supabase connection...');
  const { error: testError } = await supabase.from('scripts').select('count').limit(1);
  
  if (testError && !testError.message.includes('0 rows')) {
    console.error('❌ Connection failed:', testError.message);
    console.log('');
    console.log('💡 Make sure you have:');
    console.log('   1. Created tables using supabase.sql');
    console.log('   2. Set correct env variables');
    process.exit(1);
  }
  console.log('✅ Connected to Supabase');
  console.log('');

  // Insert scripts
  console.log('📝 Inserting demo scripts...');
  console.log('');

  for (const script of demoScripts) {
    // Delete if exists
    await supabase.from('scripts').delete().eq('slug', script.slug);
    
    const { data, error } = await supabase.from('scripts').insert(script).select('id, name, price_cents').single();

    if (error) {
      console.error(`   ❌ ${script.name}: ${error.message}`);
    } else {
      console.log(`   ✅ ${script.name}`);
      console.log(`      Prix: €${(script.price_cents / 100).toFixed(2)}`);
      console.log(`      ID: ${data.id}`);
      console.log('');
    }
  }

  console.log('====================================');
  console.log('🎉 Seed completed!');
  console.log('');
  console.log('Tes scripts sont maintenant visibles sur /scripts');
  console.log('');
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  });
