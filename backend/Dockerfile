# Basis-Image
FROM node:lts-alpine

# Arbeitsverzeichnis
WORKDIR /usr/src/app

# Abhängigkeiten installieren
COPY package*.json ./
RUN npm install --production

# Code kopieren
COPY . .

# App starten
CMD ["node", "index.js"]
