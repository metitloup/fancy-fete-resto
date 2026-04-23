# 🎡 Fancy Fête - Gestion de Commandes en Temps Réel

![Node.js](https://shields.io)
![Socket.io](https://shields.io)
![Docker](https://shields.io)

Une solution complète et légère de gestion de restauration rapide pour événements, optimisée pour un usage multi-tablettes avec synchronisation instantanée.

## 🚀 Aperçu des fonctionnalités

### 📱 Accueil (Prise de commande)
- **Multi-dispositifs** : Gestion sécurisée des conflits (une table ne peut pas être prise deux fois simultanément).
- **Interface tactile** : Personnalisation rapide (taille, cuisson, accompagnements).
- **Panier intelligent** : Modification des quantités en un clic et gestion des commandes **Express** (Frites).
- **Messages Flash** : Envoi d'alertes textuelles directes à la cuisine.

### 👨‍🍳 Cuisine (Production)
- **Barre de production** : Cumul automatique de tous les plats à préparer.
- **Alertes visuelles** : Changement de couleur dynamique selon le temps d'attente (Orange 10 min / Rouge clignotant 15 min).
- **Optimisation** : Tri automatique des tickets par type de public (**Enfant 🧸 d'abord**).

### 📊 Statistiques (Pilotage)
- Graphiques en temps réel (Ventes, Public, Cuissons).
- Indicateur de temps d'attente moyen.
- Suivi global des stocks (Compotes, Crudités).

## 🛠️ Installation

### Via Docker (Recommandé)
```bash
docker-compose up -d --build
```

### Via Node.js (Local)
1. Installer les dépendances : `npm install`
2. Lancer le serveur : `node server.js`
3. Accès : `http://localhost:3000`

## 🔐 Accès par défaut
- **Admin** : `admin` / `resto2024`
- **Serveur** : `accueil` / `accueil`

## 📂 Structure du projet
- `server.js` : Cœur de l'application (Express/Socket.io).
- `public/` : Interfaces (HTML, CSS optimisé, JS client).
- `db.json` : Persistance des données (historique et commandes).

---
*Développé pour la Fancy Fête Hell Beck.*
