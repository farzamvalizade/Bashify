from django.contrib.auth.models import AbstractUser
from django.db import models

# مدل کاربر سفارشی
class User(AbstractUser):
    email = models.EmailField(unique=True)  # ایمیل یکتا

    def __str__(self):
        return self.username


# مدل دستور سفارشی برای هر کاربر
class Command(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='commands')  # ارتباط با کاربر
    command = models.CharField(max_length=100)  # نام دستور
    output = models.TextField()  # خروجی دستور

    def __str__(self):
        return f"{self.command} by {self.user.username}"