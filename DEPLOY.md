# Швидке розгортання на Ubuntu 24.04

## Один рядок для встановлення Docker:

```bash
curl -fsSL https://get.docker.com -o get-docker.sh && sudo sh get-docker.sh && sudo usermod -aG docker $USER && newgrp docker && sudo apt install docker-compose-plugin -y
```

## Розгортання проєкту:

```bash
# 1. Клонування
git clone https://github.com/hiuhisfhshf/DZKA.git
cd DZKA

# 2. Створення .env файлу
cat > .env << 'EOF'
DEBUG=False
SECRET_KEY=$(openssl rand -hex 32)
ALLOWED_HOSTS=*
POSTGRES_DB=neondb
POSTGRES_USER=neondb_owner
POSTGRES_PASSWORD=$(openssl rand -base64 32)
POSTGRES_HOST=db
POSTGRES_PORT=5432
CORS_ALLOWED_ORIGINS=http://$(hostname -I | awk '{print $1}'):80,http://localhost:80
EOF

# 3. Запуск
docker compose -f docker-compose.prod.yml up -d

# 4. Налаштування файрволу
sudo ufw allow 80/tcp && sudo ufw allow 8000/tcp && sudo ufw enable
```

## Перевірка:

```bash
# Статус
docker compose -f docker-compose.prod.yml ps

# Логи
docker compose -f docker-compose.prod.yml logs -f
```

## Доступ:

- Frontend: `http://YOUR_SERVER_IP`
- Backend: `http://YOUR_SERVER_IP:8000`
- API Docs: `http://YOUR_SERVER_IP:8000/swagger/`

Детальна інструкція: дивіться `UBUNTU_DEPLOYMENT.md`

