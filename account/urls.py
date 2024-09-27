from django.urls import path
from .views import profile,execute_command,user_terminal
from django.contrib.auth.views import LogoutView

app_name="account"

urlpatterns=[
    path('',profile,name="profile"),
    path('api/execute-command/', execute_command, name='execute_command'),
    path("logout/",LogoutView.as_view(),name="logout"),
]