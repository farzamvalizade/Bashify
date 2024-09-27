from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import User, Command


class SignUpForm(UserCreationForm):
    class Meta:
        model = User
        fields = ('username', 'email', 'password1', 'password2')


class UserChangeForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ('username',)


# forms.py

class CommandForm(forms.ModelForm):
    class Meta:
        model = Command
        fields = ['command', 'output']
        widgets = {
            'command': forms.TextInput(attrs={'placeholder': 'Enter command'}),
            'output': forms.Textarea(attrs={'placeholder': 'Enter output'}),
        }
