from django.urls import re_path
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from management.view.main.messages import DirectMessageConsumer
from django.core.asgi import get_asgi_application

websocket_urlpatterns = [
    re_path(r'^ws/dm/(?P<user_id>\w+)/$', DirectMessageConsumer.as_asgi()),
]

application = ProtocolTypeRouter({
    'http': get_asgi_application(),
    'websocket': AuthMiddlewareStack(
        URLRouter(websocket_urlpatterns)
    ),
}) 