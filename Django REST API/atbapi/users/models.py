from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

class CustomUser(AbstractUser):
    image_small = models.ImageField(upload_to='images/', blank=True, null=True)
    image_medium = models.ImageField(upload_to='images/', blank=True, null=True)
    image_large = models.ImageField(upload_to='images/', blank=True, null=True)

    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True, null=True)

    def __str__(self):
        return self.email