from rest_framework import serializers
from .utils import compress_image
from .models import CustomUser
import re

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = [
            'id', 
            'username', 
            'email', 
            'phone',
            'first_name', 
            'last_name', 
            'image_small', 
            'image_medium', 
            'image_large'
        ]

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        min_length=8,
        style={'input_type': 'password'}
    )
    image = serializers.ImageField(write_only=True, required=False)

    class Meta:
        model = CustomUser
        fields = [
            'username',
            'email',
            'password',
            'first_name',
            'last_name',
            'image',
            'phone',
        ]

    def validate_username(self, value):
        if len(value) < 3:
            raise serializers.ValidationError("Логін повинен містити мінімум 3 символи")
        if not re.match(r'^[a-zA-Z0-9_]+$', value):
            raise serializers.ValidationError("Логін може містити лише літери, цифри та підкреслення")
        if CustomUser.objects.filter(username=value).exists():
            raise serializers.ValidationError("Користувач з таким логіном вже існує")
        return value


class UserUpdateSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(write_only=True, required=False, allow_null=True)

    class Meta:
        model = CustomUser
        fields = [
            'username',
            'email',
            'first_name',
            'last_name',
            'phone',
            'image',
        ]
        extra_kwargs = {
            'username': {'required': False},
            'email': {'required': False},
            'first_name': {'required': False},
            'last_name': {'required': False},
            'phone': {'required': False},
        }

    def validate_image(self, value):
        if value:
            if value.size > 5 * 1024 * 1024:
                raise serializers.ValidationError("Розмір зображення не повинен перевищувати 5MB")
            valid_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
            if not any(value.name.lower().endswith(ext) for ext in valid_extensions):
                raise serializers.ValidationError("Підтримуються лише формати: JPG, JPEG, PNG, GIF, WEBP")
        return value

    def update(self, instance, validated_data):
        image = validated_data.pop('image', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if image:
            optimized, name = compress_image(image, size=(300, 300))
            instance.image_small.save(name, optimized, save=False)

            optimized, name = compress_image(image, size=(800, 800))
            instance.image_medium.save(name, optimized, save=False)

            optimized, name = compress_image(image, size=(1200, 1200))
            instance.image_large.save(name, optimized, save=False)

        instance.save()
        return instance

    def validate_email(self, value):
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_pattern, value):
            raise serializers.ValidationError("Введіть коректну електронну адресу")
        if CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("Ця електронна пошта вже зареєстрована")
        return value

    def validate_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError("Пароль повинен містити мінімум 8 символів")
        if not re.search(r'\d', value):
            raise serializers.ValidationError("Пароль повинен містити хоча б одну цифру")
        if not re.search(r'[a-zA-ZА-Яа-я]', value):
            raise serializers.ValidationError("Пароль повинен містити хоча б одну літеру")
        if not re.search(r'[A-ZА-Я]', value):
            raise serializers.ValidationError("Пароль повинен містити хоча б одну велику літеру")
        if not re.search(r'[a-zа-я]', value):
            raise serializers.ValidationError("Пароль повинен містити хоча б одну малу літеру")
        if not re.search(r'[!@#$%^&*()_+\-=\[\]{};\':"\\|,.<>\/?]', value):
            raise serializers.ValidationError("Пароль повинен містити хоча б один спеціальний символ")
        return value

    def validate_first_name(self, value):
        if len(value) < 2:
            raise serializers.ValidationError("Ім'я повинно містити мінімум 2 символи")
        if not re.match(r'^[А-Яа-яA-Za-z\s]+$', value):
            raise serializers.ValidationError("Ім'я може містити лише літери")
        return value.strip()

    def validate_last_name(self, value):
        if len(value) < 2:
            raise serializers.ValidationError("Прізвище повинно містити мінімум 2 символи")
        if not re.match(r'^[А-Яа-яA-Za-z\s]+$', value):
            raise serializers.ValidationError("Прізвище може містити лише літери")
        return value.strip()

    def validate_phone(self, value):
        if not value:
            return value
        phone_digits = re.sub(r'[^\d]', '', value)
        if len(phone_digits) < 10:
            raise serializers.ValidationError("Номер телефону повинен містити мінімум 10 цифр")
        if len(phone_digits) > 15:
            raise serializers.ValidationError("Номер телефону занадто довгий")
        return value

    def validate_image(self, value):
        if value:
            # Перевірка розміру файлу (максимум 5MB)
            if value.size > 5 * 1024 * 1024:
                raise serializers.ValidationError("Розмір зображення не повинен перевищувати 5MB")
            # Перевірка типу файлу
            valid_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
            if not any(value.name.lower().endswith(ext) for ext in valid_extensions):
                raise serializers.ValidationError("Підтримуються лише формати: JPG, JPEG, PNG, GIF, WEBP")
        return value

    def create(self, validated_data):
        image = validated_data.pop('image', None)
        user = CustomUser.objects.create_user(
            **validated_data
        )

        if image:
            # створюємо 3 розміри
            optimized, name = compress_image(image, size=(300, 300))
            user.image_small.save(name, optimized, save=False)

            optimized, name = compress_image(image, size=(800, 800))
            user.image_medium.save(name, optimized, save=False)

            optimized, name = compress_image(image, size=(1200, 1200))
            user.image_large.save(name, optimized, save=False)

            user.save()

        return user