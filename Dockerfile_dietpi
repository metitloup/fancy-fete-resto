# Image de base ultra-légère pour processeur ARM (Raspberry Pi)
FROM node:18-alpine

# Dossier de l'application
WORKDIR /app

# On copie d'abord uniquement les fichiers de dépendances
COPY package*.json ./

# Installation propre des modules (sans les outils de développement)
RUN npm install --omit=dev

# On copie tout le reste de ton projet (HTML, CSS, JS, Chart.js, etc.)
COPY . .

# Port utilisé par l'app
EXPOSE 3000

# Lancement du serveur
CMD ["node", "server.js"]
