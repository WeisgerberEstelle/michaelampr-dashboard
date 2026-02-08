# Dashboard

Dashboard de gestion d'épargne et de fonds d'investissement.

## Stack technique

### Client
- **Next.js 15** (App Router)
- **React 19**
- **TypeScript**
- **TailwindCSS 4**
- **Recharts** - graphiques
- **Framer Motion** - animations
- **SWR** - data fetching
- **next-intl** - internationalisation
- **Jest + React Testing Library** - tests

### Serveur
- **Express 5**
- **MongoDB / Mongoose 9**
- **JWT** - authentification
- **Zod** - validation
- **bcrypt** - hashage mots de passe

## Installation

### Prérequis
- Node.js 18+
- MongoDB (local ou Atlas)

### Configuration

1. Cloner le repo
```bash
git clone <repo-url>
cd michaelampr-dashboard
```

2. Installer les dépendances
```bash
cd server && npm install
cd ../client && npm install
```

3. Configurer les variables d'environnement

**server/.env**
```
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<db>
JWT_SECRET=your-secret-key
PORT=3001
```

**client/.env.local**
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## Lancement

### Développement

```bash
# Terminal 1 - Serveur
cd server && npm run dev

# Terminal 2 - Client
cd client && npm run dev
```

- Client : http://localhost:3000
- API : http://localhost:3001

### Seed data
```bash
cd server && npm run seed
```

## Tests

```bash
cd client && npm test
```

## Structure du projet

```
├── client/
│   ├── src/
│   │   ├── app/              # Pages Next.js (App Router)
│   │   ├── components/       # Composants React
│   │   │   ├── dashboard/    # SavingsCard, Charts, TransactionHistory
│   │   │   └── deposit/      # FundSelector, AllocationInputs, DepositForm
│   │   ├── lib/              # API client, hooks
│   │   ├── types/            # Types TypeScript
│   │   ├── __tests__/        # Tests unitaires
│   │   └── __mocks__/        # Mocks pour tests
│   └── messages/             # Traductions (fr.json)
│
└── server/
    └── src/
        ├── models/           # Modèles Mongoose
        ├── routes/           # Routes Express
        ├── middlewares/      # Auth JWT
        └── index.js          # Point d'entrée
```

## Fonctionnalités

- **Dashboard** : vue d'ensemble de l'épargne, graphiques d'évolution et répartition
- **Versement** : formulaire de dépôt avec validation IBAN/BIC
- **Authentification** : login JWT
