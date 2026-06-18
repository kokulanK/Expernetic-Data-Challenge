from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    # Added specific fields if needed
    pass

    def __str__(self):
        return self.username
