from django import forms
from .models import CustomUser
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.forms import AuthenticationForm
import re

class CustomUserCreationForm(UserCreationForm):
    username = forms.CharField(
        label="Логін",
        min_length=3,
        max_length=30,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'pattern': '[a-zA-Z0-9_]+',
            'title': 'Логін може містити лише літери, цифри та підкреслення'
        })
    )
    email = forms.EmailField(
        label="Електронна пошта",
        required=True,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'type': 'email'
        })
    )
    first_name = forms.CharField(
        label="Ім'я",
        required=True,
        min_length=2,
        max_length=30,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'pattern': '[А-Яа-яA-Za-z\\s]+',
            'title': "Ім'я може містити лише літери"
        })
    )
    last_name = forms.CharField(
        label="Прізвище",
        required=True,
        min_length=2,
        max_length=30,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'pattern': '[А-Яа-яA-Za-z\\s]+',
            'title': 'Прізвище може містити лише літери'
        })
    )
    phone = forms.CharField(
        label="Номер телефону",
        required=True,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'pattern': '[0-9+\\-\\s()]+',
            'title': 'Введіть коректний номер телефону'
        })
    )
    image = forms.ImageField(
        label="Зображення",
        required=True,
        widget=forms.FileInput(attrs={
            'class': 'form-control',
            'accept': 'image/*'
        })
    )
    password1 = forms.CharField(
        label="Пароль",
        min_length=8,
        widget=forms.PasswordInput(attrs={
            'class': 'form-control',
            'minlength': '8'
        })
    )
    password2 = forms.CharField(
        label="Повторіть пароль",
        widget=forms.PasswordInput(attrs={
            'class': 'form-control',
            'minlength': '8'
        })
    )

    class Meta:
        model = CustomUser
        fields = ('username', 'email', 'first_name', 'last_name', 'phone', 'image', 'password1', 'password2')

    def clean_username(self):
        username = self.cleaned_data.get('username')
        if not username:
            raise forms.ValidationError("Логін не може бути порожнім")
        
        # Перевірка на допустимі символи
        if not re.match(r'^[a-zA-Z0-9_]+$', username):
            raise forms.ValidationError("Логін може містити лише літери, цифри та підкреслення")
        
        # Перевірка на унікальність
        if CustomUser.objects.filter(username=username).exists():
            raise forms.ValidationError("Користувач з таким логіном вже існує")
        
        return username

    def clean_email(self):
        email = self.cleaned_data.get('email')
        if not email:
            raise forms.ValidationError("Електронна пошта не може бути порожньою")
        
        # Перевірка формату email
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_pattern, email):
            raise forms.ValidationError("Введіть коректну електронну адресу")
        
        if CustomUser.objects.filter(email=email).exists():
            raise forms.ValidationError("Ця електронна пошта вже зареєстрована")
        
        return email

    def clean_first_name(self):
        first_name = self.cleaned_data.get('first_name')
        if not first_name:
            raise forms.ValidationError("Ім'я не може бути порожнім")
        
        if len(first_name) < 2:
            raise forms.ValidationError("Ім'я повинно містити мінімум 2 символи")
        
        if not re.match(r'^[А-Яа-яA-Za-z\s]+$', first_name):
            raise forms.ValidationError("Ім'я може містити лише літери")
        
        return first_name.strip()

    def clean_last_name(self):
        last_name = self.cleaned_data.get('last_name')
        if not last_name:
            raise forms.ValidationError("Прізвище не може бути порожнім")
        
        if len(last_name) < 2:
            raise forms.ValidationError("Прізвище повинно містити мінімум 2 символи")
        
        if not re.match(r'^[А-Яа-яA-Za-z\s]+$', last_name):
            raise forms.ValidationError("Прізвище може містити лише літери")
        
        return last_name.strip()

    def clean_phone(self):
        phone = self.cleaned_data.get('phone')
        if not phone:
            raise forms.ValidationError("Номер телефону не може бути порожнім")
        
        # Видаляємо всі символи крім цифр для перевірки
        phone_digits = re.sub(r'[^\d]', '', phone)
        
        if len(phone_digits) < 10:
            raise forms.ValidationError("Номер телефону повинен містити мінімум 10 цифр")
        
        if len(phone_digits) > 15:
            raise forms.ValidationError("Номер телефону занадто довгий (максимум 15 цифр)")
        
        # Перевірка на коректний формат українського номера (опціонально)
        if phone_digits.startswith('380'):
            if len(phone_digits) != 12:
                raise forms.ValidationError("Номер телефону у форматі +380 повинен містити 12 цифр")
        elif phone_digits.startswith('0'):
            if len(phone_digits) != 10:
                raise forms.ValidationError("Номер телефону у форматі 0XX повинен містити 10 цифр")
        
        return phone

    def clean_image(self):
        image = self.cleaned_data.get('image')
        if not image:
            raise forms.ValidationError("Будь ласка, завантажте зображення")
        
        # Перевірка розміру файлу (максимум 5MB)
        if image.size > 5 * 1024 * 1024:
            raise forms.ValidationError("Розмір зображення не повинен перевищувати 5MB")
        
        # Перевірка типу файлу
        valid_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
        if not any(image.name.lower().endswith(ext) for ext in valid_extensions):
            raise forms.ValidationError("Підтримуються лише формати: JPG, JPEG, PNG, GIF, WEBP")
        
        return image

    def clean_password1(self):
        password1 = self.cleaned_data.get('password1')
        if not password1:
            raise forms.ValidationError("Пароль не може бути порожнім")
        
        if len(password1) < 8:
            raise forms.ValidationError("Пароль повинен містити мінімум 8 символів")
        
        if len(password1) > 128:
            raise forms.ValidationError("Пароль занадто довгий (максимум 128 символів)")
        
        # Перевірка на наявність хоча б однієї цифри
        if not re.search(r'\d', password1):
            raise forms.ValidationError("Пароль повинен містити хоча б одну цифру")
        
        # Перевірка на наявність хоча б однієї літери (великої або малої)
        if not re.search(r'[a-zA-ZА-Яа-я]', password1):
            raise forms.ValidationError("Пароль повинен містити хоча б одну літеру")
        
        # Перевірка на наявність великої літери
        if not re.search(r'[A-ZА-Я]', password1):
            raise forms.ValidationError("Пароль повинен містити хоча б одну велику літеру")
        
        # Перевірка на наявність малої літери
        if not re.search(r'[a-zа-я]', password1):
            raise forms.ValidationError("Пароль повинен містити хоча б одну малу літеру")
        
        # Перевірка на наявність спеціального символу
        if not re.search(r'[!@#$%^&*()_+\-=\[\]{};\':"\\|,.<>\/?]', password1):
            raise forms.ValidationError("Пароль повинен містити хоча б один спеціальний символ (!@#$%^&*()_+-=[]{}|;:,.<>?)")
        
        return password1
    
class CustomUserLogin(AuthenticationForm):
    username = forms.CharField(
        label="Ім'я користувача",
        widget=forms.TextInput(attrs={'class' : 'form-control'})
    )
    password = forms.CharField(
        label="Пароль",
        widget=forms.PasswordInput(attrs={'class': 'form-control'})
    )