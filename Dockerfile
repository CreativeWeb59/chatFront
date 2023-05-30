# Utilisez une image de base Node.js pour construire votre projet Angular
FROM node:latest AS node

# Définissez le répertoire de travail dans le conteneur
WORKDIR /app

# Copiez les fichiers de configuration
#COPY /app/chatFront/package*.json ./
COPY . .

# Installez les dépendances
RUN npm install

# Copiez le reste des fichiers du projet
# COPY /app/chatFront/*.* .

# Compilez le projet Angular
RUN npm run build --prod

# Utilisez une image Nginx pour exécuter votre application Angular
FROM nginx:alpine

# Copiez les fichiers de votre application Angular dans le répertoire web par défaut de Nginx
COPY --from=node /app/dist/chat-front /usr/share/nginx/html

# Copiez votre fichier de configuration Nginx personnalisé
# COPY chatFront/nginx.conf /etc/nginx/nginx.conf