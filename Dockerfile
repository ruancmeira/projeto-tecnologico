# Dockerfile multi-estágio para projeto completo (backend, frontend e banco)
# Stage 1: Build do Backend
FROM node:18-alpine AS backend-build

WORKDIR /app/backend

# Copiar apenas package.json primeiro para aproveitar cache das dependências
COPY backend/package*.json ./
RUN npm ci

COPY backend/ ./
RUN npm run build
RUN npx prisma generate

# Stage 2: Build do Frontend
FROM node:18-alpine AS frontend-build

WORKDIR /app/frontend

# Copiar apenas package.json primeiro para aproveitar cache das dependências
COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build

# Stage 3: Imagem final com Nginx
FROM nginx:alpine

# Instalar Node.js e MySQL client
RUN apk add --update --no-cache nodejs npm mysql-client

# Copiar build do frontend para o servidor Nginx
COPY --from=frontend-build /app/frontend/dist /usr/share/nginx/html

# Copiar build do backend
COPY --from=backend-build /app/backend/dist /app/backend/dist
COPY --from=backend-build /app/backend/node_modules /app/backend/node_modules
COPY --from=backend-build /app/backend/package.json /app/backend/package.json
COPY --from=backend-build /app/backend/prisma /app/backend/prisma

# Copiar configuração do Nginx
COPY frontend/nginx.conf /etc/nginx/nginx.conf

# Configurar MySQL
ENV MYSQL_ROOT_PASSWORD=user123
ENV MYSQL_DATABASE=projeto_tcc
ENV MYSQL_USER=user_projeto_tcc
ENV MYSQL_PASSWORD=user123

# Variáveis de ambiente do backend
ENV DATABASE_URL="mysql://$MYSQL_USER:$MYSQL_PASSWORD@localhost:3306/$MYSQL_DATABASE"
ENV JWT_SECRET="FEmtDK8X15_p6IQP6GJA"
ENV JWT_EXPIRES_IN="30d"
ENV PORT=3333
ENV NODE_ENV=production

# Criar diretório para dados do MySQL
RUN mkdir -p /var/lib/mysql && \
    chown -R mysql:mysql /var/lib/mysql

# Criar script de inicialização mais confiável
WORKDIR /app
RUN echo '#!/bin/sh\n\
# Iniciar MySQL em background\n\
mysqld --user=mysql --datadir=/var/lib/mysql &\n\
\n\
# Aguardar MySQL iniciar com timeout\n\
echo "Aguardando MySQL iniciar..."\n\
timeout=30\n\
while [ $timeout -gt 0 ] && ! mysqladmin ping -h"localhost" --silent; do\n\
    sleep 1\n\
    timeout=$((timeout-1))\n\
    if [ $timeout -eq 0 ]; then\n\
        echo "Timeout: MySQL não iniciou. Continuando mesmo assim..."\n\
        break\n\
    fi\n\
done\n\
\n\
# Tentar configurar banco de dados\n\
echo "Configurando banco de dados..."\n\
cd /app/backend\n\
npx prisma db push || echo "Erro ao configurar banco, mas continuando..."\n\
npx ts-node prisma/seed.ts || echo "Erro ao popular banco, mas continuando..."\n\
\n\
# Iniciar backend em background\n\
echo "Iniciando backend..."\n\
cd /app/backend\n\
node dist/main.js &\n\
\n\
# Iniciar Nginx em foreground\n\
echo "Iniciando Nginx..."\n\
nginx -g "daemon off;"\n' > /app/start.sh

RUN chmod +x /app/start.sh

# Expor portas
EXPOSE 80 3333

# Comando de inicialização
CMD ["/app/start.sh"] 