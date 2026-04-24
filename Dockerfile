FROM node:18-alpine

# Installation de tzdata pour gérer le fuseau horaire
RUN apk add --no-cache tzdata

WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
COPY . .

# Définition du fuseau horaire
ENV TZ=Europe/Brussels

EXPOSE 3000
CMD ["node", "server.js"]
