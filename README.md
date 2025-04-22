# Cinetech

Cinetech est une application web inspirée de Crunchyroll, dédiée à l'affichage d'informations sur les films et séries via l'API The Movie Database (TMDb).

## Technologies

### Front-end
- React
- React Router
- Tailwind CSS
- Axios

### Back-end
- Node.js
- Express
- MySQL
- JSON Web Token (JWT)
- Bcrypt

## Fonctionnalités

- Affichage des films et séries tendances
- Détails des films et séries (résumé, genres, casting, recommandations)
- Authentification (inscription, connexion)
- Gestion des favoris
- Système de commentaires avec réponses et option "spoiler"
- Recherche de films et séries

## Installation

### Prérequis
- Node.js et npm
- MySQL
- Clé API TMDb (à obtenir sur [https://www.themoviedb.org/settings/api](https://www.themoviedb.org/settings/api))

### Configuration

1. Cloner le dépôt :
```
git clone https://github.com/votre-utilisateur/cinetech.git
cd cinetech
```

2. Installer les dépendances du serveur :
```
cd server
npm install
```

3. Installer les dépendances du client :
```
cd ../client
npm install
```

4. Configurer les variables d'environnement :

   - Modifier les fichiers `.env` dans les dossiers `client` et `server`
   - Modifier les variables selon votre configuration (clé API TMDb, configuration de la base de données, etc.)

5. Créer la base de données MySQL :
   - Créer une base de données nommée `cinetech`
   - Le schéma de la base de données sera créé automatiquement au démarrage du serveur

### Démarrage

1. Démarrer le serveur de développement (back-end) :
```
cd server
npm run dev
```

2. Démarrer l'application client (front-end) :
```
cd client
npm run dev
```

3. Accéder à l'application dans votre navigateur à l'adresse `http://localhost:5173`

## Structure du projet

```
cinetech/
├── client/              # Front-end React
│   ├── src/
│   │   ├── components/  # Composants React
│   │   ├── pages/       # Pages de l'application
│   │   ├── services/    # Services API
│   │   ├── hooks/       # Hooks personnalisés
│   │   ├── context/     # Contextes React
│   │   └── assets/      # Images, styles, etc.
│   └── ...
└── server/              # Back-end Express
    ├── controllers/     # Contrôleurs (logique métier)
    ├── models/          # Modèles (interaction avec la BDD)
    ├── routes/          # Routes API
    ├── middlewares/     # Middlewares Express
    ├── config/          # Configuration
    └── ...
```

## Développement

Ce projet suit l'architecture MVC (Modèle-Vue-Contrôleur) :
- **Modèle** : Gestion des données et interactions avec la base de données (dossier `server/models/`)
- **Vue** : Interface utilisateur React (dossier `client/`)
- **Contrôleur** : Logique métier (dossier `server/controllers/`)

## Licence

Ce projet est sous licence MIT.