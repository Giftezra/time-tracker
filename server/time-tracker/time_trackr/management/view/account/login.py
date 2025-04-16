from rest_framework_simplejwt.views import TokenObtainPairView
from management.serializer import CustomTokenObtainPairSerializer
from django_ratelimit.decorators import ratelimit
from django.utils.decorators import method_decorator

@method_decorator(ratelimit(key='ip', rate='5/m', block=True, method=['POST']), name='dispatch')
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer