@echo off
echo ====================================
echo Запуск Django REST API на порту 4099
echo ====================================
echo.

REM Перевірка чи активоване віртуальне середовище
if not exist .venv (
    echo Створюємо віртуальне середовище...
    python -m venv .venv
)

REM Активуємо віртуальне середовище
call .venv\Scripts\activate.bat

REM Оновлюємо pip
python.exe -m pip install --upgrade pip

REM Встановлюємо залежності
echo Встановлюємо залежності...
pip install -r requirements.txt

REM Перехід до директорії проєкту
cd atbapi

REM Перевірка чи є міграції
echo Перевірка міграцій...
python manage.py makemigrations --check >nul 2>&1
if errorlevel 1 (
    echo Створюємо міграції...
    python manage.py makemigrations
)

REM Застосування міграцій
echo Застосовуємо міграції...
python manage.py migrate

echo.
echo ====================================
echo Запускаємо сервер на порту 4099...
echo ====================================
echo Сервер буде доступний за адресою: http://127.0.0.1:4099/
echo API документація: http://127.0.0.1:4099/swagger/
echo Для зупинки натисніть Ctrl+C
echo.

REM Запуск сервера
python manage.py runserver 4099

pause




