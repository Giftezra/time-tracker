""" The file is used to update the users availability status."""

from rest_framework.response import Response
from rest_framework import status
from datetime import datetime, timedelta
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from dateutil.relativedelta import relativedelta

from ...models import Availability
from ...serializer import AvailabilitySerializer
from management.view.main.decorators import staff_required
from staff.models import Staff

from django.shortcuts import get_object_or_404


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@staff_required
def create_availablity(request):
    """Create the users availability based on the provided data."""
    try:
        staff = get_object_or_404(Staff, user=request.user)
            
        start_date = datetime.strptime(request.data.get('start_date'), '%Y-%m-%d')
        end_date = datetime.strptime(request.data.get('end_date'), '%Y-%m-%d')
        
        # Validate dates
        if start_date > end_date:
            return Response({'error': 'Start date cannot be after end date'}, status=status.HTTP_400_BAD_REQUEST)
            
        repeat_pattern = request.data.get('repeat', 'never')
        
        # Get optional fields
        start_time = request.data.get('start_time')
        end_time = request.data.get('end_time')
        note = request.data.get('note')
        
        # If times are provided, validate them
        if start_time and end_time:
            if start_time >= end_time:
                return Response({'error': 'Start time must be before end time'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Calculate recurrence end date based on repeat pattern
        if repeat_pattern != 'never':
            recurrence_end = start_date + relativedelta(years=1)
        else:
            recurrence_end = end_date
        
        availabilities = []
        current_date = start_date
        
        while current_date <= recurrence_end:
            availability_data = {
                'staff': staff,
                'start_date': current_date,
                'end_date': current_date,
                # For recurring, each instance is for a single day
            }
            
            # Only add time fields if they were provided
            if start_time is not None:
                availability_data['start_time'] = start_time
            if end_time is not None:
                availability_data['end_time'] = end_time
            if note is not None:
                availability_data['note'] = note
            print('availability data', availability_data)
                
            availability = Availability.objects.create(**availability_data)
            availabilities.append(availability)
            
            # Calculate next date based on repeat pattern
            if repeat_pattern == 'daily':
                current_date += timedelta(days=1)
            elif repeat_pattern == 'weekly':
                current_date += timedelta(weeks=1)
            elif repeat_pattern == 'monthly':
                current_date += relativedelta(months=1)
            else:  # 'never'
                break
            
            # Stop if we've reached the end date
            if current_date > end_date:
                break
        
        return Response({
            'message': 'Availability created successfully',
            'count': len(availabilities)
        }, status=status.HTTP_200_OK)
        
    except ValueError as e:
        return Response({'error': 'Invalid date format'}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
  
  
  
  
@api_view(['GET'])
@permission_classes([IsAuthenticated])
@staff_required
def get_marked_availabilities(request):
  """Get all availability dates for the user to mark on the calendar."""
  try:
    staff = get_object_or_404(Staff, user=request.user)
    availabilities = Availability.objects.filter(staff=staff)
    dates = {}
    for availability in availabilities:
      dates[str(availability.start_date)] = {
        'startingDay': True,
        'endingDay': True,
        'color': 'red',
        'textColor': 'white'
      }
    return Response({'marked_dates': dates}, status=status.HTTP_200_OK)
  except Exception as e:
    return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
  
  

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
@staff_required
def update_availability(request):
    """Update the user availability status given the availability id and the request user."""
    availability_id = request.data.get('availability_id')
    try:
        staff = get_object_or_404(Staff, user=request.user)
        availability = get_object_or_404(Availability, id=availability_id, staff=staff)
        
        availability.start_date = request.data.get('start_date', availability.start_date)
        availability.end_date = request.data.get('end_date', availability.end_date)
        availability.start_time = request.data.get('start_time', availability.start_time)
        availability.end_time = request.data.get('end_time', availability.end_time)
        availability.save()
        
        return Response({'message': 'Availability updated successfully'}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)