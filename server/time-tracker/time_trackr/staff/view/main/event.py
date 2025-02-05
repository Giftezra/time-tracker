from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from datetime import datetime, timedelta

from django.shortcuts import get_object_or_404

from management.models import Shift
from management.serializer import ShiftSerializer

from management.view.main.decorators import staff_required





""" Method retrieves shifts assigned to a user that would start in the next 24 hours."""
@api_view(['GET'])
@permission_classes([IsAuthenticated])
@staff_required
def get_shift_in_12(request):
    now = datetime.now()
    later = now + timedelta(hours=12)
    try:
        # Get the user's shifts that start in the next 24 hours
        shifts = Shift.objects.filter(staff=request.user, status='assigned', start__gte=now, start__lte=later)
        
        # Serialize the shifts and return the response
        serializer = ShiftSerializer(shifts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    
    
""" Return all user assigned shifts.
    Use the filter method to filer shifts assigned to the user.
    Serialize the shifts and return many to indicate multiple shifts.
    Return the serialized data in the response.
"""
@api_view(['GET'])
@permission_classes([IsAuthenticated])
@staff_required
def get_all_assigned_shifts(request):
    try:
      shift = Shift.objects.filter(staff=request.user, status='assigned')
      serializer = ShiftSerializer(shift, many=True)
      return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
      return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    
    
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
@staff_required
def get_shift_by_date(request):
    """ Method is used by the staff to get the shifts data given a date.
      The date is used to filter the shifts assigned to the user. 
    """
    if not request.data:
        return Response({'error': 'Please provide a date'}, status=status.HTTP_400_BAD_REQUEST)
      
      # Get the date from the request data
      # retrive the shift using the data and get the associated task
      # check if the task start time is equal to the date
      # serialize the shifts and return the response data to the client
    date = request.data.get('date')
    shift = Shift.objects.filter(staff=request.user, status__in=['assigned', 'pending'])
    task = shift.task
    if task.start_time == date:
        serializer = ShiftSerializer(shift, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'No shift for the date'}, status=status.HTTP_400_BAD_REQUEST)
      
 