# Dockerfile para projeto completo
FROM node:18-alpine

# Instalar pacotes necessários
RUN apk add --no-cache \
    mariadb \
    mariadb-client \
    nginx \
    bash

# Instalar @nestjs/cli globalmente
RUN npm install -g @nestjs/cli

# Configurar diretórios
WORKDIR /app
COPY . /app/

# Inicializar o banco de dados
RUN mkdir -p /var/lib/mysql && \
    mkdir -p /run/mysqld && \
    chown -R mysql:mysql /var/lib/mysql /run/mysqld && \
    mariadb-install-db --user=mysql --datadir=/var/lib/mysql

# Configuração do banco
ENV MYSQL_ROOT_PASSWORD=user123
ENV MYSQL_DATABASE=projeto_tcc
ENV MYSQL_USER=user_projeto_tcc
ENV MYSQL_PASSWORD=user123
ENV DATABASE_URL=mysql://user_projeto_tcc:user123@localhost:3306/projeto_tcc
ENV JWT_SECRET=FEmtDK8X15_p6IQP6GJA
ENV JWT_EXPIRES_IN=30d
ENV PORT=3333
ENV NODE_ENV=production

# Script de inicialização
COPY <<-"EOF" /app/start.sh
#!/bin/sh
set -e

echo "=== INICIANDO SERVIÇOS ==="

# 1. INICIAR MARIADB
echo "1. Iniciando MariaDB..."
cat > /etc/my.cnf << CNFEOF
[mysqld]
user = mysql
datadir = /var/lib/mysql
port = 3306
bind-address = 0.0.0.0
skip-name-resolve
CNFEOF

/usr/bin/mysqld --defaults-file=/etc/my.cnf &

# Aguardar MariaDB iniciar
echo "Aguardando MariaDB iniciar..."
max_tries=30
count=0
while [ $count -lt $max_tries ] && ! mysqladmin ping -h"localhost" --silent 2>/dev/null; do
    sleep 2
    count=$((count+1))
    echo "Tentativa $count/$max_tries"
done

if ! mysqladmin ping -h"localhost" --silent 2>/dev/null; then
    echo "❌ MariaDB não iniciou. Abortando."
    exit 1
fi
echo "✅ MariaDB iniciado"

# 2. CONFIGURAR BANCO DE DADOS
echo "2. Configurando banco de dados..."
mysql -e "CREATE DATABASE IF NOT EXISTS $MYSQL_DATABASE;"
mysql -e "CREATE USER IF NOT EXISTS '$MYSQL_USER'@'localhost' IDENTIFIED BY '$MYSQL_PASSWORD';"
mysql -e "CREATE USER IF NOT EXISTS '$MYSQL_USER'@'%' IDENTIFIED BY '$MYSQL_PASSWORD';"
mysql -e "GRANT ALL PRIVILEGES ON $MYSQL_DATABASE.* TO '$MYSQL_USER'@'localhost';"
mysql -e "GRANT ALL PRIVILEGES ON $MYSQL_DATABASE.* TO '$MYSQL_USER'@'%';"
mysql -e "FLUSH PRIVILEGES;"
echo "✅ Banco de dados configurado"

# 3. INSTALAR DEPENDÊNCIAS DO BACKEND
echo "3. Instalando dependências do backend..."
cd /app/backend
npm ci
echo "✅ Dependências do backend instaladas"

# 4. EXECUTAR DB SETUP
echo "4. Executando db:setup..."
npm run db:setup
echo "✅ Banco configurado com db:setup"

# 5. COMPILAR BACKEND
echo "5. Compilando backend..."
npm run build
echo "✅ Backend compilado"

# 6. INSTALAR DEPENDÊNCIAS E COMPILAR FRONTEND
echo "6. Configurando frontend..."
cd /app/frontend
npm ci --include=dev
npm run build
mkdir -p /usr/share/nginx/html
cp -r dist/* /usr/share/nginx/html/
echo "✅ Frontend configurado"

# 7. CONFIGURAR NGINX
echo "7. Configurando Nginx..."
cat > /etc/nginx/nginx.conf << NGINXEOF
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    sendfile on;
    keepalive_timeout 65;

    server {
        listen 80;
        server_name localhost;

        root /usr/share/nginx/html;
        index index.html;

        # Serve static files
        location / {
            try_files \$uri \$uri/ /index.html;
        }

        # Proxy API requests to backend
        location /api/ {
            proxy_pass http://localhost:3333/;
            proxy_http_version 1.1;
            proxy_set_header Upgrade \$http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
            proxy_cache_bypass \$http_upgrade;
        }
    }
}
NGINXEOF

nginx -t
echo "✅ Nginx configurado"

# 8. INICIAR SERVIÇOS
echo "8. Iniciando serviços finais..."
cd /app/backend

# Iniciar backend em background
node dist/src/main.js &
BACKEND_PID=$!
echo "Backend iniciado com PID: $BACKEND_PID"

# Iniciar nginx em background (já está configurado para rodar como daemon)
nginx
echo "Nginx iniciado"

echo "=== TODOS OS SERVIÇOS INICIADOS ==="
echo "- Nginx na porta 80"
echo "- Backend na porta $PORT"
echo "- MariaDB na porta 3306"

# Manter container rodando
echo "Monitorando logs..."
tail -f /var/log/nginx/access.log /var/log/nginx/error.log
EOF

RUN chmod +x /app/start.sh

# Expor portas
EXPOSE 80 3333 3306

# Comando para iniciar
CMD ["/bin/sh", "/app/start.sh"] 