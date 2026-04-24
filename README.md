# 🍽️ Fancy Fête Resto - Déploiement DietPi (Raspberry Pi)

Cette version est optimisée pour tourner sur des micro-ordinateurs à ressources limitées (Raspberry Pi Zero, 1, 2, 3) sous **DietPi**.

## ⚙️ Optimisations spécifiques
- **Zéro Rebuild** : Le code (`public/` et `server.js`) est monté en volume. Les modifications sont instantanées via un simple `restart`.
- **Protection Carte SD** : Utilisation de `tmpfs` pour déporter les fichiers temporaires (`/tmp`) en RAM et réduction drastique des logs Docker.
- **Gestion RAM** : Limite de mémoire fixée à 256Mo pour éviter les plantages (OOM Killer).
- **Heure Locale** : Synchronisation automatique avec l'horloge du DietPi (Europe/Brussels).

## 🛠️ Installation Rapide

1. **Préparer les fichiers de données**
   Avant de lancer Docker, créez le fichier de base de données pour éviter que Docker ne crée un dossier à la place :
   ```bash
   touch db.json
   echo '{"plateauxOccupes":[],"commandesActives":[],"commandesPretes":[],"historique":[]}' > db.json
   chmod 666 db.json
   ```

2. **Premier lancement (Build initial)**
   Cette étape est longue sur Raspberry Pi mais ne doit être faite qu'une seule fois :
   ```bash
   docker compose up -d --build
   ```

3. **Accès**
   L'application répond sur le **port 80** (standard HTTP).
   - URL : `http://[IP_DU_DIETPI]`

## 🔄 Mise à jour du code (Sans attente)

Puisque les fichiers sont montés en volumes, vous n'avez pas besoin de reconstruire l'image Docker pour changer le HTML, le CSS ou les Plats :

1. **Récupérer le code depuis la branche main** :
   ```bash
   git checkout main -- public/ server.js
   ```

2. **Appliquer les changements** :
   ```bash
   docker compose restart
   ```
   *C'est instantané (1 à 2 secondes).*

## 🔒 Accès Sécurisés
- **Utilisateur Accueil** : `accueil` / `accueil`
- **Utilisateur Admin** : `admin` / `resto2024`

## 📊 Statistiques & Rapports
Le fichier `db.json` est synchronisé en temps réel sur le disque du DietPi. Vous pouvez générer le bilan financier à tout moment depuis le terminal du Pi :
```bash
python3 bilan_fete_pro.py
```

---
*Note : Si vous ajoutez des dépendances dans `package.json`, un `docker compose up -d --build` redeviendra nécessaire.*
