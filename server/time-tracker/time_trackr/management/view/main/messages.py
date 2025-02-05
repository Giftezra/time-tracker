from channels.generic.websocket import AsyncWebsocketConsumer
import json
from asgiref.sync import sync_to_async
from django.contrib.auth import get_user_model
from management.models import Message, ChatRoom
from django.shortcuts import get_object_or_404

class DirectMessageConsumer(AsyncWebsocketConsumer):
    """
    Handles real-time WebSocket connections for direct messaging between two users.
    Designed to work with React Native frontend.
    """
    
    async def connect(self):
        """
        Called when a client attempts to open a WebSocket connection.
        Sets up the direct message channel between two users.
        """
        # Get the IDs of both participants
        self.user1_id = self.scope["user"].id
        self.user2_id = self.scope['url_route']['kwargs']['user_id']
        
        # Create a unique channel name for these two users (sorted to ensure consistency)
        participant_ids = sorted([str(self.user1_id), str(self.user2_id)])
        self.room_group_name = f'dm_{"_".join(participant_ids)}'

        # Add this connection to the direct message group
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
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        sender_id = self.scope["user"].id

        # Save the direct message
        saved_message = await self.save_message(sender_id, self.user2_id, message)

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
        
        # Get or create a private chat room for these two users
        participant_ids = sorted([sender_id, recipient_id])
        room_name = f'dm_{"_".join(map(str, participant_ids))}'
        
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
