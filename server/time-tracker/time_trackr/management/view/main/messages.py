from channels.generic.websocket import AsyncWebsocketConsumer
import json
from asgiref.sync import sync_to_async
from django.contrib.auth import get_user_model
from management.models import Message, ChatRoom
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
from rest_framework_simplejwt.tokens import AccessToken
from django.contrib.auth import get_user_model
from urllib.parse import parse_qs
from channels.db import database_sync_to_async
from datetime import datetime

class DirectMessageConsumer(AsyncWebsocketConsumer):
    """
    Handles real-time WebSocket connections for direct messaging between two users.
    Designed to work with React Native frontend.
    """
    
    @database_sync_to_async
    def get_user_from_token(self, token_key):
        try:
            # Verify and decode the token
            access_token = AccessToken(token_key)
            user_id = access_token.payload.get('user_id')
            User = get_user_model()
            return User.objects.get(id=user_id)
        except Exception as e:
            print(f"Token authentication error: {str(e)}")
            return None

    async def connect(self):
        """
        Called when a client attempts to open a WebSocket connection.
        Sets up the direct message channel between two users.
        """
        # Get token from query string
        query_string = parse_qs(self.scope['query_string'].decode())
        token = query_string.get('token', [None])[0]

        if not token:
            print("No token provided")
            await self.close()
            return

        # Authenticate user with token
        user = await self.get_user_from_token(token)
        if not user:
            print("Invalid token or user not found")
            await self.close()
            return

        # Set authenticated user in scope
        self.scope['user'] = user
        
        # Get the IDs of both participants
        self.user1_id = user.id
        self.user2_id = self.scope['url_route']['kwargs']['user_id']
        print('Authenticated user:', self.user1_id)
        print('Target user:', self.user2_id)
        
        # Create a unique channel name for these two users
        participant_ids = sorted([str(self.user1_id), str(self.user2_id)])
        self.room_group_name = f'dm_{"_".join(participant_ids)}'

        # Add this connection to the channel group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        """
        Called when a client closes the WebSocket connection.
        """
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        """
        Called when a message is received from a client.
        Sends the message to the other participant.
        
        Args:
            text_data (str): JSON string containing the message data
        """
        try:
            text_data_json = json.loads(text_data)
            message = text_data_json['message']
            sender_id = self.scope["user"].id

            # Save the direct message
            saved_message = await self.save_message(sender_id, self.user2_id, message)

            # Also store in Redis for fast retrieval
            await self.store_message_in_redis(
                sender_id=sender_id,
                recipient_id=self.user2_id,
                message=message,
                message_id=saved_message.id,
                timestamp=saved_message.timestamp.isoformat()
            )

            # Send message to the other participant
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'direct_message',
                    'message': message,
                    'sender_id': sender_id,
                    'timestamp': saved_message.timestamp.isoformat(),
                    'message_id': saved_message.id
                }
            )
        except json.JSONDecodeError:
            await self.send(text_data=json.dumps({
                'error': 'Invalid JSON format'
            }))
        except Exception as e:
            print(f"Error processing message: {str(e)}")
            await self.send(text_data=json.dumps({
                'error': 'Internal server error'
            }))



    async def direct_message(self, event):
        """
        Sends the message to the WebSocket client.
        
        Args:
            event (dict): Contains message data to be sent
        """
        await self.send(text_data=json.dumps({
            'message': event['message'],
            'sender_id': event['sender_id'],
            'timestamp': event['timestamp'],
            'message_id': event['message_id']
        }))

    
    
    @database_sync_to_async
    def store_message_in_redis(self, sender_id, recipient_id, message, message_id, timestamp):
        import redis
        r = redis.Redis(host='localhost', port=6379, db=0)
    
        # Store message in sorted set by timestamp
        room_key = f"messages:{self.room_group_name}"
        message_data = json.dumps({
            'id': message_id,
            'sender': sender_id,
            'content': message,
            'timestamp': timestamp
        })
        r.zadd(room_key, {message_data: float(datetime.now().timestamp())})
    
        # Keep only last 100 messages per room
        r.zremrangebyrank(room_key, 0, -101)

    @sync_to_async
    def save_message(self, sender_id, recipient_id, message):
        """
        Saves a direct message to the database.
        
        Args:
            sender_id (int): ID of the user sending the message
            recipient_id (int): ID of the user receiving the message
            message (str): Content of the message
            
        Returns:
            Message: The saved message object
        """
        sender = get_user_model().objects.get(id=sender_id)
        recipient = get_user_model().objects.get(id=recipient_id)
        
        # Convert IDs to strings before sorting
        participant_ids = sorted([str(sender_id), str(recipient_id)])
        room_name = f'dm_{"_".join(participant_ids)}'
        
        chat_room, _ = ChatRoom.objects.get_or_create(
            name=room_name,
            defaults={'is_private': True}
        )
        
        # Ensure only these two users are participants
        chat_room.participants.set([sender, recipient])
        
        # Create and return the message
        return Message.objects.create(
            sender=sender,
            room=chat_room,
            content=message
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_chat_history(request):
    """
    Fetch chat history between the authenticated user and another user
    """
    try:
        other_user_id = request.GET.get('user_id')
        if not other_user_id:
            return Response({'error': 'user_id is required'}, status=status.HTTP_400_BAD_REQUEST)

        # Verify the other user exists
        User = get_user_model()
        try:
            other_user = User.objects.get(id=other_user_id)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        # Get the chat room name
        participant_ids = sorted([str(request.user.id), str(other_user_id)])
        room_name = f'dm_{"_".join(participant_ids)}'
    
        # Get or create the chat room
        chat_room, created = ChatRoom.objects.get_or_create(
            name=room_name,
            defaults={'is_private': True}
        )
        
        if created:
            chat_room.participants.add(request.user, other_user)
            return Response({'chat_history': []}, status=status.HTTP_200_OK)

        messages = Message.objects.filter(room=chat_room).order_by('timestamp')

        chat_history = [{
            'id': str(msg.id),
            'content': msg.content,
            'timestamp': msg.timestamp.isoformat(),
            'sender_id': str(msg.sender.id),
            'is_read': msg.is_read
        } for msg in messages]

        return Response({'chat_history': chat_history}, status=status.HTTP_200_OK)

    except Exception as e:
        print(f"Error in get_chat_history: {str(e)}")  # Add better logging
        return Response(
            {'error': 'An error occurred while fetching chat history'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_chat_rooms(request):
    """
    Get all chat rooms where the authenticated user is a participant
    """
    try:
        # Get all chat rooms where the user is a participant
        chat_rooms = ChatRoom.objects.filter(participants=request.user)
        
        chat_rooms_data = []
        for room in chat_rooms:
            # Get the other participant (not the current user)
            other_participant = room.participants.exclude(id=request.user.id).first()
            if not other_participant:
                continue
                
            # Get the last message in this room
            last_message = Message.objects.filter(room=room).order_by('-timestamp').first()
            
            chat_rooms_data.append({
                'id': str(room.id),
                'name': other_participant.get_full_name(),
                'lastMessage': last_message.content if last_message else "",
                'time': last_message.timestamp.isoformat() if last_message else "",
                'userId': str(other_participant.id)
            })
        return Response({'chat_rooms': chat_rooms_data}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_conversation(request):
    """ Delete the chatroom between the two users """
    try:
        chat_room_id = request.data.get('chat_room_id')
        chat_room = ChatRoom.objects.get(id=chat_room_id)
        # Check if the request user is a participant in the chatroom
        if request.user not in chat_room.participants.all():
            return Response({'error': 'You are not a participant in this chatroom'}, status=status.HTTP_403_FORBIDDEN)
        chat_room.delete()
        return Response({'message': 'Chatroom deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_message(request):
    """ Delete a message from the chatroom """
    try:
        # Get the chatroom with the given chatroom id and filter messages in the chatroom
        # Using the message id, delete the message from the chatroom
        chatroom_id = request.data.get('chat_room_id')
        message_id = request.data.get('message_id')
        chatroom = ChatRoom.objects.get(id=chatroom_id)
        message = Message.objects.get(id=message_id, room=chatroom)
        # Check if the user is a participant in the chatroom
        if request.user not in chatroom.participants.all():
            return Response({'error': 'You are not a participant in this chatroom'}, status=status.HTTP_403_FORBIDDEN)
        message.delete()
        return Response({'message': 'Message deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
