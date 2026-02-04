# 🎮 Zen Scripts Shop

E-commerce complet pour vendre des scripts Cronus Zen avec paiement Stripe, webhook, et email automatique.

## 📁 Structure du Projet

```
zen-scripts-shop/
├── frontend/          # Next.js 14 App Router + TypeScript + Tailwind
├── backend/           # Node.js + Express + TypeScript
├── supabase.sql       # Schéma de base de données
└── README.md          # Ce fichier
```

## 🚀 Déploiement Complet (Render + Supabase)

### Étape 1 : Configuration Supabase

1. **Créer un projet Supabase**
   - Allez sur [supabase.com](https://supabase.com)
   - Créez un nouveau projet
   - Notez l'URL et la clé `service_role`

2. **Exécuter le schéma SQL**
   - Dans Supabase, allez dans "SQL Editor"
   - Copiez-collez le contenu de `supabase.sql`
   - Cliquez sur "Run"

3. **Récupérer les credentials**
   - Project Settings → API
   - Notez :
     - `Project URL` → SUPABASE_URL
     - `service_role key` → SUPABASE_SERVICE_ROLE_KEY

### Étape 2 : Configuration Stripe

1. **Créer un compte Stripe**
   - Allez sur [stripe.com](https://stripe.com)
   - Créez un compte (mode test d'abord)

2. **Récupérer les clés API**
   - Dashboard → Developers → API keys
   - Notez la `Secret key` → STRIPE_SECRET_KEY

3. **Configurer le webhook** (après déploiement backend)
   - Dashboard → Developers → Webhooks
   - Cliquez "Add endpoint"
   - URL: `https://votre-backend.onrender.com/api/webhooks/stripe`
   - Events à sélectionner: `checkout.session.completed`
   - Notez le `Signing secret` → STRIPE_WEBHOOK_SECRET

### Étape 3 : Configuration Resend (Email)

1. **Créer un compte Resend**
   - Allez sur [resend.com](https://resend.com)
   - Créez un compte gratuit

2. **Créer une API Key**
   - Dashboard → API Keys → Create
   - Notez la clé → RESEND_API_KEY

3. **Configurer un domaine** (optionnel mais recommandé)
   - Pour utiliser votre propre domaine d'envoi
   - Sinon, utilisez `onboarding@resend.dev` pour tester

### Étape 4 : Déployer le Backend sur Render

1. **Préparer le repo**
   - Poussez le code sur GitHub

2. **Créer un Web Service sur Render**
   - [render.com](https://render.com) → New → Web Service
   - Connectez votre repo GitHub
   - Configuration :
     - **Name**: `zen-scripts-backend`
     - **Root Directory**: `backend`
     - **Runtime**: Node
     - **Build Command**: `npm install && npm run build`
     - **Start Command**: `npm start`

3. **Variables d'environnement Backend**
   ```
   NODE_ENV=production
   PORT=3001
   
   SUPABASE_URL=https://xxx.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
   
   STRIPE_SECRET_KEY=sk_live_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   
   RESEND_API_KEY=re_...
   
   ADMIN_EMAIL=votre@email.com
   ADMIN_PASSWORD=VotreMotDePasseSecurise123!
   
   SITE_URL=https://votre-frontend.onrender.com
   FRONTEND_URL=https://votre-frontend.onrender.com
   ```

4. **Déployer**
   - Cliquez "Create Web Service"
   - Attendez le déploiement
   - Notez l'URL: `https://zen-scripts-backend.onrender.com`

### Étape 5 : Déployer le Frontend sur Render

1. **Créer un Web Service sur Render**
   - New → Web Service (PAS Static Site !)
   - Configuration :
     - **Name**: `zen-scripts-frontend`
     - **Root Directory**: `frontend`
     - **Runtime**: Node
     - **Build Command**: `npm install && npm run build`
     - **Start Command**: `npm start`

2. **Variables d'environnement Frontend**
   ```
   NEXT_PUBLIC_API_URL=https://zen-scripts-backend.onrender.com
   NEXT_PUBLIC_SITE_URL=https://zen-scripts-frontend.onrender.com
   ```

3. **Déployer**
   - Cliquez "Create Web Service"
   - Attendez le déploiement

### Étape 6 : Configurer le Webhook Stripe

⚠️ **IMPORTANT** : Cette étape doit être faite APRÈS le déploiement du backend.

1. Allez sur Stripe Dashboard → Developers → Webhooks
2. Cliquez "Add endpoint"
3. **Endpoint URL**: `https://zen-scripts-backend.onrender.com/api/webhooks/stripe`
4. **Events**: Sélectionnez `checkout.session.completed`
5. Cliquez "Add endpoint"
6. Copiez le "Signing secret" (commence par `whsec_`)
7. Mettez à jour la variable `STRIPE_WEBHOOK_SECRET` dans Render

### Étape 7 : Insérer les Scripts de Démo

1. En local, configurez le `.env` du backend
2. Exécutez :
   ```bash
   cd backend
   npm install
   npm run seed
   ```

Ou insérez manuellement via l'interface SQL de Supabase.

---

## 🛠️ Développement Local

### Backend

```bash
cd backend
cp .env.example .env
# Remplir le .env avec vos valeurs

npm install
npm run dev
# Serveur sur http://localhost:3001
```

### Frontend

```bash
cd frontend
cp .env.example .env.local
# NEXT_PUBLIC_API_URL=http://localhost:3001

npm install
npm run dev
# Serveur sur http://localhost:3000
```

### Tester le Webhook Stripe en Local

1. Installez Stripe CLI : https://stripe.com/docs/stripe-cli
2. Connectez-vous : `stripe login`
3. Redirigez les webhooks :
   ```bash
   stripe listen --forward-to localhost:3001/api/webhooks/stripe
   ```
4. Utilisez le secret affiché comme `STRIPE_WEBHOOK_SECRET`

---

## 📋 Endpoints API

### Publics

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/scripts` | Liste des scripts actifs |
| GET | `/api/scripts/:slug` | Détail d'un script |
| POST | `/api/checkout/create-session` | Créer une session Stripe |
| GET | `/api/checkout/session/:id` | Détails d'une commande |
| POST | `/api/support` | Envoyer un message support |

### Admin (protégés par cookie)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/login` | Connexion admin |
| POST | `/api/admin/logout` | Déconnexion |
| GET | `/api/admin/check` | Vérifier authentification |
| GET | `/api/admin/scripts` | Tous les scripts |
| POST | `/api/admin/scripts` | Créer un script |
| PUT | `/api/admin/scripts/:id` | Modifier un script |
| DELETE | `/api/admin/scripts/:id` | Supprimer (soft) |
| GET | `/api/admin/orders` | Liste des commandes |
| GET | `/api/admin/stats` | Statistiques |

### Webhook

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/webhooks/stripe` | Webhook Stripe (raw body) |

---

## 🔧 Variables d'Environnement

### Backend (.env)

```env
# Server
NODE_ENV=development
PORT=3001

# Supabase
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Resend
RESEND_API_KEY=re_...

# Admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=motdepasse-securise

# URLs
SITE_URL=http://localhost:3000
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## 🔐 Sécurité

- Les clés Stripe ne sont JAMAIS exposées au frontend
- Webhook Stripe vérifié par signature
- Cookie admin httpOnly + secure en production
- Validation Zod sur tous les inputs
- Service role Supabase uniquement côté backend

---

## 💰 Modèle de Paiement

Le paiement utilise **Stripe Checkout** avec `price_data` inline :
- Pas besoin de créer des produits/prix dans Stripe Dashboard
- Les scripts sont stockés en base de données
- Le prix est envoyé dynamiquement lors du checkout

---

## 📧 Emails

Après un paiement réussi :
1. Email de confirmation au client avec :
   - Numéro de commande
   - Instructions de livraison (Discord, serial, Marketplace)
2. Email de notification à l'admin

---

## 🎨 Pages Frontend

| Route | Description |
|-------|-------------|
| `/` | Page d'accueil |
| `/scripts` | Liste des scripts |
| `/scripts/[slug]` | Détail + achat |
| `/faq` | Questions fréquentes |
| `/support` | Formulaire de contact |
| `/success` | Page après paiement réussi |
| `/cancel` | Page si paiement annulé |
| `/admin` | Panneau administration |

---

## 🐛 Troubleshooting

### Le webhook ne fonctionne pas
- Vérifiez que l'URL du webhook est correcte
- Vérifiez que `STRIPE_WEBHOOK_SECRET` est bien configuré
- Les logs Render montrent les erreurs

### Erreur CORS
- Vérifiez `FRONTEND_URL` dans le backend
- Les cookies nécessitent `credentials: 'include'`

### Emails non reçus
- Vérifiez `RESEND_API_KEY`
- Vérifiez les logs Resend
- En dev, utilisez `onboarding@resend.dev`

### Cookie admin ne fonctionne pas
- En production, `secure: true` est requis (HTTPS)
- Vérifiez que frontend et backend sont sur des domaines compatibles

---

## 📝 License

MIT - Libre d'utilisation.
