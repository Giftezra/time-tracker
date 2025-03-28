from exponent_server_sdk import PushClient
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class NotificationView(APIView):
    def post(self, request):
        try:
            # Initialize the Expo push client
            push_client = PushClient()
            
            # Get the push token and message from the request
            push_token = request.data.get('push_token')
            title = request.data.get('title')
            message = request.data.get('message')
            notification_type = request.data.get('type', 'system')
            
            # Construct the notification
            notification = {
                'to': push_token,
                'sound': 'default',
                'title': title,
                'body': message,
                'data': {'type': notification_type}
            }
            
            # Send the notification
            response = push_client.publish(notification)
            
            return Response({'status': 'success', 'data': response}, 
                          status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({'status': 'error', 'message': str(e)}, 
                          status=status.HTTP_500_INTERNAL_SERVER_ERROR)
