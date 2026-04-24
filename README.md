# 🍽️ Fancy Fête Resto v2.0

Système de gestion de restauration événementielle (Caisse tactile + Cuisine + Statistiques) piloté par Socket.io et Docker.

## 🚀 Fonctionnalités
- **Menu Dynamique** : Entièrement configurable via `plats.json` (Prix, Icônes, Couleurs).
- **Temps Réel** : Communication bidirectionnelle Accueil <-> Cuisine via WebSockets.
- **Règles Métier** :
  - Gestion des commandes "Express" (Frites) sans numéro de table.
  - Accompagnements forcés (ex: Fromage -> Crudités).
  - Tri prioritaire des menus Enfant en cuisine.
- **Statistiques & Finance** :
  - Tableaux de bord Chart.js en temps réel.
  - Script Python pour générer des rapports Excel avec CA et temps de préparation.
- **Administration** : Interface visuelle pour modifier le menu (`admin.html`).

## 🛠️ Installation (Fedora / Docker)

1. **Cloner le projet**
   ```bash
   git clone https://github.com
   cd fancy-fete-resto
   ```

2. **Configurer l'heure et les droits**
   ```bash
   chmod 666 db.json
   ```

3. **Lancer avec Docker Compose**
   ```bash
   docker compose up -d --build
   ```

L'application est accessible sur `http://localhost:3000`.

## 📂 Structure du projet
- `/public` : Frontend (HTML/JS/CSS).
- `plats.json` : Fichier de configuration du menu.
- `server.js` : Backend Node.js / Socket.io.
- `db.json` : Base de données JSON persistante.
- `bilan_fete_pro.py` : Générateur de rapport financier Excel.

## 🔒 Accès
- **Accueil** : `accueil / accueil`
- **Admin/Cuisine/Stats** : `admin / resto2024`

## 📊 Extraction des données
Pour générer le bilan financier après l'événement :
```bash
python3 bilan_fete_pro.py
```
