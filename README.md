# 🍽️ Fancy Fête Resto v2.0

Système complet de gestion de restauration événementielle (Caisse tactile + Cuisine + Statistiques) piloté par Node.js, Socket.io et Docker.

## 🚀 Fonctionnalités
- **Menu Dynamique** : Entièrement configurable via `public/plats.json` (Prix, Icônes, Couleurs).
- **Zéro Rebuild** : Modifications du code (`public/` et `server.js`) appliquées instantanément via volumes Docker.
- **Temps Réel** : Synchronisation immédiate entre toutes les tablettes d'accueil et la cuisine.
- **Règles Métier** :
  - **Mode Express** : Commandes (ex: Frites) envoyées sans numéro de table.
  - **Accompagnements** : Gestion des choix forcés (ex: Fromage -> Crudités) ou variables.
  - **Cuisine** : Tri prioritaire des menus 🧸 Enfant et barre de production globale.
- **Finance** : Script Python pour générer des rapports Excel avec CA total, arrondis et temps de préparation.

## 🛠️ Installation & Lancement (Fedora / Linux)

1. **Cloner le projet**
   ```bash
   git clone git@github.com:metitloup/fancy-fete-resto.git
   cd fancy-fete-resto
   ```

2. **Initialiser la base de données**
   ```bash
   touch db.json && echo '{"plateauxOccupes":[],"commandesActives":[],"commandesPretes":[],"historique":[]}' > db.json
   chmod 666 db.json
   ```

3. **Lancer avec Docker Compose**
   ```bash
   docker compose up -d --build
   ```

L'application est accessible sur `http://localhost:3000`.

## 🔄 Mise à jour rapide (Hot Reload)
Grâce au montage en volumes, vous n'avez pas besoin de reconstruire l'image Docker pour les changements usuels :
- **HTML / CSS / JS / Plats** : Modifiez le fichier et faites **F5** sur le navigateur.
- **Logic Serveur (`server.js`)** : Modifiez et tapez `docker compose restart`.

## 📂 Structure du projet
- `/public` : Frontend dynamique, styles, icônes et `plats.json`.
- `server.js` : Moteur de l'application (Node.js / Socket.io).
- `db.json` : Base de données JSON persistante.
- `bilan_fete_pro.py` : Script d'extraction financière vers Excel.

## 🔒 Accès
- **Accueil** : `accueil / accueil`
- **Admin/Cuisine/Stats** : `admin / resto2024`
- **Configurateur** : `http://localhost:3000/admin.html`

## 📊 Bilan Financier
Pour générer le rapport Excel `Bilan_Financier_2026-04-24.xlsx` :
```bash
python3 bilan_fete_pro.py
```
*(Ou utilisez l'alias `bilan` si configuré).*
