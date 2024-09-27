"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,include
from account.views import home_view,LoginView,Register,PasswordChangeView,user_terminal,activate,get_username
           
urlpatterns = [
    path('admin/', admin.site.urls),
    path("", home_view,name="home"),
    path("login/", LoginView.as_view(),name="login"),
    path('signup/', Register.as_view(), name='signup'),
    path('change_password/', PasswordChangeView.as_view(), name='change_password'),
    path("account/", include("account.urls")),
    path('<str:username>/', user_terminal, name='user_terminal'),
    path('activate/<uidb64>/<token>/', activate, name='activate'),
    path('api/get-username/', get_username, name='get_username'),
    
]
