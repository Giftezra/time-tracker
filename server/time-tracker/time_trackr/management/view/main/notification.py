from exponent_server_sdk import PushClient
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from management.models import User

class NotificationTokenView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            token = request.data.get('token')
            if not token:
                return Response(
                    {'error': 'Token is required'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Create or update token for user
            user, created = User.objects.update_or_create(
                id=request.user.id,
                token=token,
                defaults={'allow_push_notification': True}
            )

            return Response({
                'status': 'success',
                'message': 'Token registered successfully'
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class NotificationView(APIView):
    permission_classes = [IsAuthenticated]


    def post(self, request):
        try:
            # Initialize the Expo push client
            push_client = PushClient()
            
            # Get the user and message details from the request
            user_id = request.data.get('user_id')
            title = request.data.get('title')
            message = request.data.get('message')
            notification_type = request.data.get('type', 'system')
            
            # Get all active tokens for the user
            tokens = NotificationToken.objects.filter(
                user_id=user_id,
                is_active=True
            )
            
            if not tokens:
                return Response(
                    {'error': 'No active notification tokens found for user'}, 
                    status=status.HTTP_404_NOT_FOUND
                )
            
            responses = []
            for token in tokens:
                # Construct the notification
                notification = {
                    'to': token.token,
                    'sound': 'default',
                    'title': title,
                    'body': message,
                    'data': {'type': notification_type}
                }
                
                # Send the notification
                response = push_client.publish(notification)
                responses.append(response)
            
            return Response(
                {'status': 'success', 'data': responses}, 
                status=status.HTTP_200_OK
            )
            
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
