from django.http import JsonResponse
from django.urls import resolve, get_resolver, Resolver404
from django.contrib.auth import logout
from django.shortcuts import render, redirect
from django.contrib.auth.views import LoginView
from django.urls import reverse_lazy
from django.views.generic.edit import CreateView
from django.contrib.auth.views import PasswordChangeView
from django.shortcuts import get_object_or_404
from django.contrib.auth.decorators import login_required
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.template.loader import render_to_string
from django.core.mail import EmailMessage
from django.http import HttpResponse
from django.contrib.sites.shortcuts import get_current_site
from .tokens import account_activation_token
from django.shortcuts import render, get_object_or_404
from .forms import SignUpForm
from .models import User
from .models import Command




# Create your views here.




class LoginView(LoginView):
    def get_success_url(self):
        # اینجا مشخص می‌کنیم که بعد از ورود موفق به کجا هدایت شود
        return reverse_lazy('account:profile')





# ویو برای نمایش و ویرایش پروفایل کاربر
@login_required
def profile(request):
    commands = Command.objects.filter(user=request.user)
    if request.method == 'POST':
        command = request.POST.get('command')
        output = request.POST.get('output')
        if command and output:
            Command.objects.create(user=request.user, command=command, output=output)
        return redirect('account:profile')

    return render(request, 'registration/profile.html', {'commands': commands})
# ویو برای تغییر پسورد
class PasswordChangeView(PasswordChangeView):
    template_name = 'registration/change_password.html'
    success_url = reverse_lazy('account:profile')


@login_required
def user_terminal(request, username):
    user = get_object_or_404(User, username=username)
    commands = Command.objects.filter(user=user)

    # Generate help command output dynamically
    help_commands = commands.exclude(command='help').values_list('command', flat=True)
    help_output = 'Available commands:\n' + '\n'.join(f'- {cmd}' for cmd in help_commands)

    help_command = Command.objects.filter(user=user, command='help').first()
    if not help_command:
        help_command = Command(user=user, command='help', output=help_output)
        help_command.save()
    else:
        help_command.output = help_output
        help_command.save()
    
    return render(request, 'registration/terminal.html', {'user': user, 'commands': commands})


def execute_command(request):
    username = request.GET.get('username')
    command = request.GET.get('command')
    
    if not username or not command:
        return JsonResponse({'output': 'Invalid request'}, status=400)
    
    user = get_object_or_404(User, username=username)
    cmd = Command.objects.filter(user=user, command=command).first()

    if cmd:
        return JsonResponse({'output': cmd.output})
    else:
        return JsonResponse({'output': 'Command not found'})




class Register(CreateView):
    form_class = SignUpForm
    template_name = "registration/signup.html"

    def form_valid(self, form):
        user = form.save(commit=False)
        user.is_active = False
        user.save()
        current_site = get_current_site(self.request)
        mail_subject = 'فعال سازی اکانت'
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = account_activation_token.make_token(user)
        message = render_to_string('registration/activate_account.html', {
            'user': user,
            'domain': current_site.domain,
            'uid': uid,
            'token': token,
        })
        to_email = form.cleaned_data.get('email')
        email = EmailMessage(mail_subject, message, to=[to_email])
        email.send()
        return render(self.request, "registration/activate_message.html")


def activate(request, uidb64, token):
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except(TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None
    if user is not None and account_activation_token.check_token(user, token):
        user.is_active = True
        user.save()
        return render(request, 'registration/activate_success.html',{'message':'your account activated successfuly!'})
    else:
        return render(request, 'registration/activate_success.html',{'message':'cannot activate your account! the like expired!!!'})



# Home view to redirect logged-in users to terminal
def home_view(request):
    usernames = User.objects.values_list('username', flat=True)
    
    return render(request, 'home.html', {'usernames': usernames})  



from django.http import JsonResponse
from django.contrib.auth.decorators import login_required

@login_required
def get_username(request):
    return JsonResponse({'username': request.user.username})
