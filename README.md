# DZKA Project

Full-stack проєкт з Django REST API backend та React frontend.

## Структура проєкту

- **Django MVT** - Django проєкт з MVT архітектурою
- **Django REST API** - REST API backend на Django REST Framework
- **my-vite** - React frontend на Vite з TypeScript

## Швидкий старт

### Розгортання на Ubuntu 24.04

Детальна інструкція: [UBUNTU_DEPLOYMENT.md](UBUNTU_DEPLOYMENT.md)

Швидкий старт: [DEPLOY.md](DEPLOY.md)

### Основні кроки:

1. Встановити Docker та Docker Compose
2. Клонувати репозиторій
3. Створити `.env` файл
4. Запустити через `docker compose -f docker-compose.prod.yml up -d`

## Docker Images

Проєкт використовує готові образи з Docker Hub:
- `space1156/dzka-backend:latest` - Django REST API
- `space1156/dzka-frontend:latest` - React frontend

## Доступ до сервісів

Після розгортання:
- **Frontend**: `http://YOUR_SERVER_IP`
- **Backend API**: `http://YOUR_SERVER_IP:8000`
- **API Documentation**: `http://YOUR_SERVER_IP:8000/swagger/`

## Документація

- [UBUNTU_DEPLOYMENT.md](UBUNTU_DEPLOYMENT.md) - Детальна інструкція по розгортанню на Ubuntu
- [DEPLOY.md](DEPLOY.md) - Швидкий старт
- [DEPLOYMENT.md](DEPLOYMENT.md) - Загальна інструкція по розгортанню

## Технології

- **Backend**: Django 6.0, Django REST Framework, PostgreSQL
- **Frontend**: React 19, TypeScript, Vite, Ant Design, Tailwind CSS
- **Deployment**: Docker, Docker Compose, Nginx

## Ліцензія

MIT

