# 🎮 POKYNOV - Jeu Rétro Pokémon

Bienvenue sur **POKYNOV**, un jeu de rôle rétro inspiré de l'univers Pokémon. L'application est séparée en deux parties : un **frontend** propulsé par Phaser 3 (Vite + TypeScript) pour le rendu du jeu, et un **backend** en Node.js connecté à des services via Docker pour la gestion de l'application.

---

## 🛠️ Prérequis

Avant de lancer l'application, assurez-vous d'avoir installé sur votre machine :
* [Node.js](https://nodejs.org/) (Version 18 ou supérieure)
* [Docker](https://www.docker.com/) et **Docker Compose**

---

## 🚀 Installation et Lancement

Pour démarrer l'application localement, suivez scrupuleusement les étapes ci-dessous dans l'ordre.

### 1. Cloner le projet
Ouvrez votre terminal et placez-vous dans votre dossier de travail :
```bash
git clone https://github.com/Florentpng/YnovGame.git
cd YNOVGAME
```

### 2. Démarrer et lancer le Backend
* Naviguer dans le dossier backend :
```bash
cd backend
```

* Configurer les variables d'environnement (dupliquez le fichier d'exemple pour créer votre propre fichier .env) :
```bash
cp .env.exemple .env
```

* Installer les dépendances Node.js du serveur :
```bash
npm install
```

* Lancer les conteneurs Docker :
```bash
docker compose up -d
```

* Lancer le serveur backend
```bash
npm run dev
```

### 3. Lancer le Frontend
* Se placer dans le dossier de l'application frontend :
```bash
cd frontend/mon-app
```

* Installer les dépendances du projet Phaser :
```bash
npm install
```

* Lancer le serveur de développement frontend :
```bash
npm run dev
```
