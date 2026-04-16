# Node.js 24.15.0 LTS "Krypton" — Alpine 3.23
FROM node:24.15.0-alpine

# Dossier de travail dans le conteneur
WORKDIR /app

# Copier package.json en premier (optimisation cache Docker)
COPY package*.json ./

# Installer les dépendances
RUN npm install --production

# Copier tout le reste du code
COPY . .

# Exposer le port Express
EXPOSE 3000

# Lancer le serveur
CMD ["node", "server.js"]