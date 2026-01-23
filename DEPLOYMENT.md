# Інструкція по розгортанню

## 1. Створення Docker Images та завантаження на Docker Hub

### Крок 1: Вхід в Docker Hub
```bash
docker login
# Введіть ваш Docker Hub username та password
```

### Крок 2: Збірка та публікація образів
```bash
# Backend
cd "Django REST API"
docker build -f ../Dockerfile.backend -t space1156/dzka-backend:latest .
docker push space1156/dzka-backend:latest

# Frontend
cd ../my-vite
docker build -f ../Dockerfile.frontend -t space1156/dzka-frontend:latest .
docker push space1156/dzka-frontend:latest
```

**Примітка:** Образи вже завантажені на Docker Hub і готові до використання.

## 2. Розгортання на Ubuntu 24.04

### Крок 1: Встановлення Docker
```bash
# Оновлення системи
sudo apt update && sudo apt upgrade -y

# Встановлення Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Додавання користувача до групи docker
sudo usermod -aG docker $USER
newgrp docker

# Встановлення Docker Compose
sudo apt install docker-compose-plugin -y

# Перевірка встановлення
docker --version
docker compose version
```

### Крок 2: Клонування репозиторію
```bash
git clone https://github.com/hiuhisfhshf/DZKA.git
cd DZKA
```

### Крок 3: Налаштування змінних середовища
Створіть файл `.env` в корені проєкту:
```bash
nano .env
```

Додайте наступний вміст (замініть значення на ваші):
```env
# Django Settings
DEBUG=False
SECRET_KEY=your-very-secure-secret-key-here
ALLOWED_HOSTS=*

# Database Settings
POSTGRES_DB=neondb
POSTGRES_USER=neondb_owner
POSTGRES_PASSWORD=your-secure-password
POSTGRES_HOST=db
POSTGRES_PORT=5432

# CORS Settings (замініть на IP вашого сервера)
CORS_ALLOWED_ORIGINS=http://YOUR_SERVER_IP:80,http://localhost:80
```

### Крок 4: Запуск через Docker Compose

**Варіант A: Використання локальної збірки**
```bash
docker compose up -d --build
```

**Варіант B: Використання образів з Docker Hub (рекомендовано)**

Файл `docker-compose.prod.yml` вже налаштований з образами `space1156/dzka-backend` та `space1156/dzka-frontend`. Просто запустіть:
```bash
docker compose -f docker-compose.prod.yml up -d
```

### Крок 5: Налаштування файрволу
```bash
# Дозволити HTTP та API порти
sudo ufw allow 80/tcp
sudo ufw allow 8000/tcp
sudo ufw enable
```

### Крок 6: Перевірка роботи

1. Перевірте статус контейнерів:
```bash
docker compose ps
```

2. Перевірте логи:
```bash
docker compose logs -f
```

3. Відкрийте в браузері:
   - Frontend: `http://YOUR_SERVER_IP`
   - Backend API: `http://YOUR_SERVER_IP:8000`
   - API Documentation: `http://YOUR_SERVER_IP:8000/swagger/`

## 3. Корисні команди

### Перегляд логів
```bash
# Всі сервіси
docker compose logs -f

# Конкретний сервіс
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f db
```

### Зупинка сервісів
```bash
docker compose down
```

### Перезапуск сервісів
```bash
docker compose restart
```

### Видалення всіх контейнерів та volumes
```bash
docker compose down -v
```

### Виконання команд в контейнері
```bash
# Django міграції
docker compose exec backend python manage.py migrate

# Django shell
docker compose exec backend python manage.py shell

# Створення суперкористувача
docker compose exec backend python manage.py createsuperuser
```

## 4. Troubleshooting

### Проблеми з підключенням до бази даних
```bash
# Перевірка статусу БД
docker compose exec db psql -U neondb_owner -d neondb -c "SELECT version();"
```

### Проблеми з CORS
Переконайтеся, що в `.env` файлі правильно вказано `CORS_ALLOWED_ORIGINS` з IP адресою вашого сервера.

### Проблеми з міграціями
```bash
docker compose exec backend python manage.py migrate
```

### Перебудова образів
```bash
docker compose build --no-cache
docker compose up -d
```

### Перевірка доступності портів
```bash
sudo netstat -tulpn | grep :80
sudo netstat -tulpn | grep :8000
```

## 5. Оновлення проєкту

```bash
# Зупинити контейнери
docker compose down

# Оновити код
git pull

# Перебудувати та запустити
docker compose up -d --build
```

## 6. Безпека

⚠️ **Важливо для production:**

1. Змініть `SECRET_KEY` на унікальний та безпечний
2. Встановіть `DEBUG=False`
3. Налаштуйте `ALLOWED_HOSTS` з конкретними доменами/IP
4. Використовуйте сильні паролі для бази даних
5. Налаштуйте SSL/TLS сертифікати (Let's Encrypt)
6. Регулярно оновлюйте образи та залежності

