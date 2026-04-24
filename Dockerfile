# Image ultra-légère pour ARM
FROM node:18-alpine

# Installation de tzdata pour l'heure Europe/Brussels
RUN apk add --no-cache tzdata

# Dossier de travail
WORKDIR /app

# Installation des dépendances (optimisée pour le cache)
COPY package*.json ./
RUN npm install --omit=dev && npm cache clean --force

# Copie du reste de l'application
COPY . .

# Port interne
EXPOSE 3000

# Lancement (Corrigé)
CMD ["node", "server.js"]
