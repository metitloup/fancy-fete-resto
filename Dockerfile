FROM node:18-slim
WORKDIR /app
# On copie le package.json d'abord pour optimiser le cache
COPY package*.json ./
RUN npm install
# On copie le reste
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
