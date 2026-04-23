# Image ultra-légère pour ARM
FROM node:18-alpine

# Dossier de travail
WORKDIR /app

# Installation des dépendances (optimisée pour le cache)
COPY package*.json ./
RUN npm install --omit=dev && npm cache clean --force

# Copie du reste de l'application
COPY . .

# --- SÉCURITÉ ANTI-BUG "DOSSIER DB.JSON" ---
# On crée le fichier JSON vide s'il n'existe pas déjà
RUN if [ ! -f db.json ]; then \
    echo '{"plateauxOccupes":[],"commandesActives":[],"commandesPretes":[],"historique":[]}' > db.json; \
    fi

# Port interne
EXPOSE 3000

# Lancement
CMD ["node", "server.js"]