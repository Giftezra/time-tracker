from django.urls import re_path
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from management.view.main.messages import DirectMessageConsumer

websocket_urlpatterns = [
    re_path(r'^ws/dm/(?P<user_id>\w+)/$', DirectMessageConsumer.as_asgi()),
]

application = ProtocolTypeRouter({
    'websocket': AuthMiddlewareStack(
        URLRouter(websocket_urlpatterns)
    ),
})

# Make sure this is available for import
websocket_application = application 