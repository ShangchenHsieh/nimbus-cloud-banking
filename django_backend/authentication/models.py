from django.db import models

from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.contrib.auth.models import PermissionsMixin


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError('email field cannot be empty')
        if not password:
            raise ValueError('password field cannot be empty')
        user = self.model(email=email, **extra_fields)  # creates a user in memory, it is not saved ot the database yet
        user.set_password(password)                     # sets user's password
        user.save(using=self._db)                       # saves user to database
        return user

    def create_manger(self, email, password, **extra_fields):
        if not password:
            raise ValueError('The Password field must be set')
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)
    
    
    # This method may or may not be needed. Will determine as development process moves forward
    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)



# CustomUser database table. Has attributes below.
class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=30, blank=False)
    last_name = models.CharField(max_length=30, blank=False)
    phone = models.CharField(max_length=30, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    
    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return f'{self.id} - {self.email}'