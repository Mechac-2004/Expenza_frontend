# Expenza Frontend

Application web Next.js pour la gestion de transactions financières.

## 🚀 Démarrage Rapide

### Prérequis

- Node.js 18 ou supérieur
- npm ou yarn

### Installation

1. **Cloner le projet**
```bash
git clone https://github.com/Mechac-2004/Expenza_frontend.git
cd Expenza_frontend
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Créer le fichier .env**
```bash
touch .env
```

Ajouter dans `.env` :
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/
```

> ⚠️ **Important** : L'URL doit se terminer par `/`

4. **Démarrer le serveur de développement**
```bash
npm run dev
```

L'application démarre sur **http://localhost:3000**

## 📦 Scripts Disponibles

```bash
# Démarrage en mode développement
npm run dev

# Build pour la production
npm run build

# Démarrage en mode production
npm start

# Linter
npm run lint
```

## 🎨 Fonctionnalités

### Authentification
- ✅ Inscription avec prénom, nom, téléphone, email
- ✅ Connexion avec email et mot de passe
- ✅ Déconnexion
- ✅ Protection des routes
- ✅ Gestion automatique des tokens JWT
- ✅ Refresh automatique des tokens expirés

### Gestion des Transactions
- ✅ Affichage de toutes les transactions
- ✅ Ajout de nouvelles transactions
- ✅ Suppression de transactions
- ✅ Calcul automatique du solde
- ✅ Distinction revenus/dépenses (montants positifs/négatifs)

### Interface
- ✅ Design moderne avec TailwindCSS et DaisyUI
- ✅ Navbar avec profil utilisateur
- ✅ Notifications toast
- ✅ Icônes Lucide React
- ✅ Responsive design

## 📁 Structure du Projet

```
frontend/
├── app/
│   ├── components/
│   │   ├── Navbar.tsx           # Barre de navigation
│   │   └── ProtectedRoute.tsx   # Protection des routes
│   ├── context/
│   │   └── AuthContext.tsx      # Gestion de l'authentification
│   ├── login/
│   │   └── page.tsx             # Page de connexion
│   ├── register/
│   │   └── page.tsx             # Page d'inscription
│   ├── api.ts                   # Configuration Axios
│   ├── layout.tsx               # Layout principal
│   ├── page.tsx                 # Page d'accueil (transactions)
│   └── globals.css              # Styles globaux
├── public/                      # Fichiers statiques
├── .env                         # Variables d'environnement
├── package.json
└── tsconfig.json
```

## 🔑 Pages

### `/` - Page d'accueil (Protégée)
- Liste des transactions
- Ajout de transactions
- Suppression de transactions
- Affichage du solde total

### `/login` - Connexion
- Formulaire de connexion (email + mot de passe)
- Lien vers l'inscription

### `/register` - Inscription
- Formulaire d'inscription complet
- Validation des mots de passe
- Redirection vers login après inscription

## 🔐 Authentification

L'application utilise JWT (JSON Web Tokens) pour l'authentification :

- **Access Token** : stocké dans `localStorage`, expire après 1h
- **Refresh Token** : stocké dans `localStorage`, expire après 7 jours
- **Refresh automatique** : si le token expire, l'app tente de le rafraîchir automatiquement

### Flux d'authentification

1. L'utilisateur se connecte
2. Le backend retourne `access_token` et `refresh_token`
3. Les tokens sont stockés dans `localStorage`
4. Chaque requête API inclut le token dans le header `Authorization`
5. Si le token expire (401), l'app tente de le rafraîchir
6. Si le refresh échoue, l'utilisateur est déconnecté

## 🎨 Design System

### Framework CSS
- **TailwindCSS 4** - Framework CSS utility-first
- **DaisyUI 5** - Composants UI pour Tailwind

### Icônes
- **Lucide React** - Bibliothèque d'icônes moderne

### Notifications
- **React Hot Toast** - Notifications toast élégantes

## 🔧 Configuration

### Variables d'environnement

Créez un fichier `.env` à la racine du projet :

```env
# URL de l'API backend (DOIT se terminer par /)
NEXT_PUBLIC_API_URL=http://localhost:8000/
```

### Connexion au Backend

Assurez-vous que le backend est démarré sur `http://localhost:8000` avant de lancer le frontend.

## 📱 Utilisation

### 1. Inscription
1. Accédez à http://localhost:3000
2. Cliquez sur "Inscrivez-vous"
3. Remplissez le formulaire :
   - Nom
   - Prénom
   - Téléphone
   - Email
   - Mot de passe
   - Confirmation du mot de passe
4. Cliquez sur "S'inscrire"

### 2. Connexion
1. Sur la page de connexion
2. Entrez votre email et mot de passe
3. Cliquez sur "Se connecter"

### 3. Gestion des Transactions
1. Une fois connecté, vous accédez à la page principale
2. Cliquez sur "Nouvelle Transaction" pour ajouter une transaction
3. Entrez :
   - Description (ex: "Salaire", "Loyer")
   - Montant (positif pour revenu, négatif pour dépense)
4. Le solde se met à jour automatiquement
5. Cliquez sur l'icône poubelle pour supprimer une transaction

### 4. Déconnexion
1. Cliquez sur votre avatar en haut à droite
2. Cliquez sur "Déconnexion"

## 🛠️ Technologies

- **Next.js 15.5.4** - Framework React
- **React 19.1.0** - Bibliothèque UI
- **TypeScript 5** - Typage statique
- **TailwindCSS 4** - Framework CSS
- **DaisyUI 5.1.25** - Composants UI
- **Axios 1.12.2** - Client HTTP
- **React Hot Toast 2.6.0** - Notifications
- **Lucide React 0.544.0** - Icônes

## 🚀 Build et Déploiement

### Build de production

```bash
npm run build
```

### Démarrer en production

```bash
npm start
```

### Déploiement

L'application peut être déployée sur :
- **Vercel** (recommandé pour Next.js)
- **Netlify**
- **AWS Amplify**
- Tout serveur Node.js

**Variables d'environnement en production :**
```env
NEXT_PUBLIC_API_URL=https://votre-api.com/
```

## 🐛 Dépannage

### Le frontend ne se connecte pas au backend

1. Vérifiez que le backend est démarré sur `http://localhost:8000`
2. Vérifiez le fichier `.env` : `NEXT_PUBLIC_API_URL=http://localhost:8000/`
3. Vérifiez que l'URL se termine bien par `/`
4. Redémarrez le serveur frontend après modification du `.env`

### Erreur CORS

Le backend doit autoriser l'origine du frontend dans `settings.py` :
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
]
```

### Token expiré

Si vous voyez des erreurs 401 :
1. Déconnectez-vous
2. Reconnectez-vous
3. Le token sera rafraîchi automatiquement

## 📞 Support

Pour toute question ou problème :
- Consultez la documentation du backend
- Vérifiez les logs de la console navigateur (F12)
- Vérifiez les requêtes réseau dans l'onglet Network

## 📄 Licence

Ce projet est privé et destiné à un usage personnel.
