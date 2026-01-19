# Django MVT Проєкт - PD421

Проєкт на Django з реалізацією системи категорій та користувачів.

## Швидкий старт

### Windows:
1. Подвійний клік на `start.bat` або виконайте в терміналі:
```bash
start.bat
```

### Linux/Mac:
```bash
chmod +x start.sh
./start.sh
```

### Або вручну:

1. **Активуйте віртуальне середовище:**
   - Windows: `.venv\Scripts\activate.bat`
   - Linux/Mac: `source .venv/bin/activate`

2. **Встановіть залежності:**
```bash
pip install -r requirements.txt
```

3. **Налаштуйте базу даних** (перевірте `djangomvt/mysite/settings.py`)

4. **Застосуйте міграції:**
```bash
cd djangomvt
py manage.py migrate
# або
python manage.py migrate
```

5. **Запустіть сервер:**
```bash
py manage.py runserver
# або
python manage.py runserver
```

**Детальні інструкції дивіться в файлі [START.md](START.md)**

---

## Функціонал проєкту

### Категорії
- ✅ Створення категорій з усіма полями
- ✅ Редактор TinyMCE для опису
- ✅ Редактор фото з Cropper.js
- ✅ Відображення списку категорій

### Користувачі
- ✅ Реєстрація користувачів
- ✅ Вхід в систему
- ✅ Вихід з системи
- ✅ Відновлення пароля по email

---

# Simple MVT - PD421 (оригінальна документація)
```
py --version
py -m venv .venv
python3 -m venv .venv
```

## Activate venv
```
.venv\Scripts\activate.bat
source .venv/bin/activate
python.exe -m pip install --upgrade pip
python3 -m pip install --upgrade pip
py -m pip install Django
python3 -m pip install Django

py

>>>import django
>>>print(django.get_version())
>>>quit()

python -m django --version
mkdir djangomvt
django-admin startproject mysite djangomvt
cd djangomvt
py manage.py runserver 9581

py manage.py startapp categories
py manage.py migrate

py manage.py startapp users

deactivate
```

## Install Postgres
```
pip install psycopg2-binary
py manage.py migrate
python3 manage.py migrate
```

## Clone Project
```
.venv\Scripts\activate.bat
pip freeze
pip freeze > requirements.txt

git clone https://github.com/novakvova/Python-Django-PD421.git
cd Python-Django-PD421
cd Django MVT
py -m venv .venv
.venv\Scripts\activate.bat

python.exe -m pip install --upgrade pip
#py -m pip install Django
pip install -r requirements.txt
cd djangomvt
py manage.py runserver 4892
```

## Додаємо модель і робимо міграції
```
pip install Pillow
py manage.py makemigrations categories
py manage.py migrate
```

## Додаю superuser
```
python manage.py createsuperuser
py manage.py createsuperuser
admin
123456
py manage.py runserver 4892
```

## Додаємо продукти і фото до них
```
py manage.py startapp products
py manage.py makemigrations products
py manage.py migrate
```

# Install Unicode
```
pip install Unidecode
```
