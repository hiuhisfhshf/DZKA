#!/bin/bash

echo "===================================="
echo "Запуск Django проєкту"
echo "===================================="
echo ""

# Перевірка чи активоване віртуальне середовище
if [ -z "$VIRTUAL_ENV" ]; then
    echo "Активуємо віртуальне середовище..."
    if [ -f ".venv/bin/activate" ]; then
        source .venv/bin/activate
    else
        echo "Помилка: Віртуальне середовище не знайдено!"
        echo "Створіть його командою: python3 -m venv .venv"
        exit 1
    fi
fi

# Перехід до директорії проєкту
cd djangomvt

# Перевірка чи є міграції
echo "Перевірка міграцій..."
python manage.py makemigrations --check > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "Створюємо міграції..."
    python manage.py makemigrations
fi

# Застосування міграцій
echo "Застосовуємо міграції..."
python manage.py migrate

echo ""
echo "===================================="
echo "Запускаємо сервер..."
echo "===================================="
echo "Сервер буде доступний за адресою: http://127.0.0.1:8000/"
echo "Для зупинки натисніть Ctrl+C"
echo ""

# Запуск сервера
python manage.py runserver






