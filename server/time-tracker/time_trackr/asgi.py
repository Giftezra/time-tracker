import os
from django.core.asgi import get_asgi_application
from .routing import websocket_application  # Import the application from routing.py

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'time_trackr.settings')

# Initialize Django ASGI application early to ensure the AppRegistry
# is populated before importing code that may import ORM models.
django_asgi_app = get_asgi_application()

# Use the imported application directly
application = websocket_application 