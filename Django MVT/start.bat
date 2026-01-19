@echo off
echo ====================================
echo Запуск Django проєкту
echo ====================================
echo.

REM Перевірка чи активоване віртуальне середовище
if not defined VIRTUAL_ENV (
    echo Активуємо віртуальне середовище...
    if exist .venv\Scripts\activate.bat (
        call .venv\Scripts\activate.bat
    ) else (
        echo Помилка: Віртуальне середовище не знайдено!
        echo Створіть його командою: py -m venv .venv
        pause
        exit /b 1
    )
)

REM Перехід до директорії проєкту
cd djangomvt

REM Перевірка чи є міграції
echo Перевірка міграцій...
py manage.py makemigrations --check >nul 2>&1
if errorlevel 1 (
    echo Створюємо міграції...
    py manage.py makemigrations
)

REM Застосування міграцій
echo Застосовуємо міграції...
py manage.py migrate

echo.
echo ====================================
echo Запускаємо сервер...
echo ====================================
echo Сервер буде доступний за адресою: http://127.0.0.1:8000/
echo Для зупинки натисніть Ctrl+C
echo.

REM Запуск сервера
py manage.py runserver

pause




