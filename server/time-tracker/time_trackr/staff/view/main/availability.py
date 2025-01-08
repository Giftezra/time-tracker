""" The file is used to update the users availability status."""

from rest_framework.response import Response
from rest_framework import status
from datetime import datetime, timedelta
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from ...models import Availability
from ...serializer import AvailabilitySerializer
from management.view.main.validation import staff_required

from django.shortcuts import get_object_or_404


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@staff_required
def create_availablity(request):
  try:
    availability = Availability.objects.create(
      user=request.user,
      start_date=request.data.get('start_date'),
      end_date=request.data.get('end_date'),
      start_time=request.data.get('start_time'),
      end_time=request.data.get('end_time'),
    )
    availability.save()
    return Response({'message': 'Availability created successfully'}, status=status.HTTP_200_OK)
  except Exception as e:
    return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
  
  
  
  
@api_view(['GET'])
@permission_classes([IsAuthenticated])
@staff_required
def get_all_availabilities(request):
  try:
    availabilities = Availability.objects.filter(user=request.user)
    serializer = AvailabilitySerializer(availabilities, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)
  except Exception as e:
    return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
  
  

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
@staff_required
def update_availability(request):
  # Update the user availability status given the availability id and the request user.
  
  availability_id = request.data.get('availability_id')
  try:
    availability = get_object_or_404(Availability, id=availability_id, user=request.user)
    availability.start_date = request.data.get('start_date', availability.start_date)
    availability.end_date = request.data.get('end_date', availability.end_date)
    availability.start_time = request.data.get('start_time', availability.start_time)
    availability.end_time = request.data.get('end_time', availability.end_time)
    availability.save()
    return Response({'message': 'Availability updated successfully'}, status=status.HTTP_200_OK)
  except Exception as e:
    return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)