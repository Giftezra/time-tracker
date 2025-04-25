""" The file is used to update the users availability status."""

from rest_framework.response import Response
from rest_framework import status
from datetime import datetime, timedelta
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from dateutil.relativedelta import relativedelta
from management.view.main.decorators import staff_required
from staff.models import Staff, Availability
from django_ratelimit.decorators import ratelimit
from django.core.cache import cache
from django.conf import settings
from management.helpers import get_cache_key
from django.db import models

from django.shortcuts import get_object_or_404


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@staff_required
def create_availablity(request):
    """Create the users availability based on the provided data."""
    try:
        staff = get_object_or_404(Staff, user=request.user)
        start_date = datetime.strptime(request.data.get('start_date'), '%Y-%m-%d').date()
        end_date = datetime.strptime(request.data.get('end_date'), '%Y-%m-%d').date()
        all_day = request.data.get('all_day', False)
        
        # Validate dates
        if start_date > end_date:
            return Response({'error': 'Start date cannot be after end date'}, status=status.HTTP_400_BAD_REQUEST)
        
        current_date = datetime.now().date()
        if start_date < current_date:
            return Response({'error': 'Start date cannot be in the past'}, status=status.HTTP_400_BAD_REQUEST)
            
        repeat_pattern = request.data.get('repeat', 'never')
        start_time = request.data.get('start_time')
        end_time = request.data.get('end_time')
        note = request.data.get('note', '')
        
        # If times are provided, validate them
        if not all_day and start_time and end_time:
            start_time_obj = datetime.strptime(start_time, '%H:%M').time()
            end_time_obj = datetime.strptime(end_time, '%H:%M').time()
            if start_time_obj >= end_time_obj:
                return Response({'error': 'Start time must be before end time'}, status=status.HTTP_400_BAD_REQUEST)
        
        availabilities = []
        current_date = start_date
        max_end_date = start_date + relativedelta(years=1) if repeat_pattern != 'never' else end_date
        
        while current_date <= max_end_date:
            # Process each day in the current range
            day = current_date
            range_end = min(end_date, current_date + (end_date - start_date))
            
            while day <= range_end:
                # Check for existing unavailability for this day
                existing = Availability.objects.filter(
                    staff=staff,
                    start_date=day,
                    end_date=day,
                    availability_status='unavailable'
                )
                
                # If all_day, check for any existing entry
                if all_day:
                    if existing.exists():
                        return Response({
                            'error': f'You already have an unavailability marked for {day}',
                            'conflict_date': str(day)
                        }, status=status.HTTP_409_CONFLICT)
                
                # If not all_day, check for time overlaps
                elif start_time and end_time:
                    overlapping = existing.filter(
                        models.Q(start_time__isnull=True) |  # Covers all-day entries
                        models.Q(end_time__isnull=True) |
                        models.Q(start_time__lt=end_time, end_time__gt=start_time)
                    )
                    if overlapping.exists():
                        return Response({
                            'error': f'You already have an unavailability that overlaps with {day} {start_time}-{end_time}',
                            'conflict_date': str(day),
                            'conflict_time': f'{start_time}-{end_time}'
                        }, status=status.HTTP_409_CONFLICT)
                
                # Create the availability if no conflicts
                availability = Availability.objects.create(
                    staff=staff,
                    start_date=day,
                    end_date=day,
                    start_time=None if all_day else start_time,
                    end_time=None if all_day else end_time,
                    note=note,
                    availability_status='unavailable'
                )
                availabilities.append(availability)
                day += timedelta(days=1)
            
            # Move to next period based on repeat pattern
            if repeat_pattern == 'daily':
                current_date += timedelta(days=1)
            elif repeat_pattern == 'weekly':
                current_date += timedelta(weeks=1)
            elif repeat_pattern == 'monthly':
                current_date += relativedelta(months=1)
            else:  # 'never'
                break
            
        return Response({
            'message': f'Successfully created {len(availabilities)} availability entries',
            'count': len(availabilities)
        }, status=status.HTTP_200_OK)
        
    except ValueError as e:
        return Response({'error': 'Invalid date format'}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
  
  
  
@api_view(['GET'])
@permission_classes([IsAuthenticated])
@staff_required
@ratelimit(key='user', rate='20/h', method=['GET'])
def get_marked_availabilities(request):
    """Get all availability dates for the user to mark on the calendar."""
    try:
        staff = get_object_or_404(Staff, user=request.user)

        availabilities = Availability.objects.filter(staff=staff, availability_status='unavailable')
        # Return an error if the user has no availabilities
        if not availabilities:
            return Response({'error': 'You have not set any availability dates yet. Please set some availability dates and return to the page.'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Get the cache key for the user
        cache_key = get_cache_key(staff.id, 'availability_dates')
        cached_data = cache.get(cache_key)
        if cached_data: # If the data is cached, return the cached data
            return Response({'marked_dates': cached_data}, status=status.HTTP_200_OK)
        
        
        dates = {}
        
        for availability in availabilities:
            current_date = availability.start_date
            end_date = availability.end_date
            
            while current_date <= end_date:
                date_str = str(current_date)
                dates[date_str] = {
                    'startingDay': current_date == availability.start_date,
                    'endingDay': current_date == end_date,
                    'color': 'blue',
                    'textColor': 'white'
                }
                current_date += timedelta(days=1)
                
        return Response({'marked_dates': dates}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
  
  

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
@staff_required
@ratelimit(key='user', rate='100/h', method=['PUT'])
def update_availability(request):
    """Update the user availability status given the availability id and the request user."""
    availability_id = request.data.get('availability_id')
    try:
        staff = get_object_or_404(Staff, user=request.user)
        availability = get_object_or_404(Availability, id=availability_id, staff=staff)
        if not availability:
            return Response({'error': 'You do not have any availability set for this day.'}, status=status.HTTP_404_NOT_FOUND)

        start_time = datetime.strptime(request.data.get('start_time'), '%H:%M').time()
        end_time = datetime.strptime(request.data.get('end_time'), '%H:%M').time()
        if start_time >= end_time:
            return Response({'error': 'Start time must be before end time'}, status=status.HTTP_400_BAD_REQUEST)
        
        availability.start_time = start_time
        availability.end_time = end_time
        availability.save()
        
        return Response({'message': 'You have updated your availability successfully.'}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
@staff_required
@ratelimit(key='user', rate='100/h', method=['GET'])
def get_day_availabilities(request):
    """Get all availability entries for a specific day."""
    try:
        staff = get_object_or_404(Staff, user=request.user)
        day = request.GET.get('date')
        print('day', day)
        
        if not day:
            return Response({'error': 'Day parameter is required'}, status=status.HTTP_400_BAD_REQUEST)
            
        date = datetime.strptime(day, '%Y-%m-%d').date()
        # Get all availabilities that cover this day
        availabilities = Availability.objects.filter(
            staff=staff,
            start_date__lte=date,
            end_date__gte=date,
            availability_status='unavailable'
        ).order_by('start_time')
        print('availabilities', availabilities)
        
        results = []
        for avail in availabilities:
            print('avail', avail)
            results = {
                'id': avail.id,
                'start_time': avail.start_time.strftime('%H:%M') if avail.start_time else None,
                'end_time': avail.end_time.strftime('%H:%M') if avail.end_time else None,
                'all_day': avail.start_time is None,
                'note': avail.note
            }
        
        return Response({
            'availability': results
        }, status=status.HTTP_200_OK)
        
    except ValueError as e:
        return Response({'error': 'Invalid date format. Use YYYY-MM-DD'}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
@staff_required
@ratelimit(key='user', rate='100/h', method=['DELETE'])
def delete_availability(request):
    """Delete availability entries for a specific day."""
    try:
        staff = get_object_or_404(Staff, user=request.user)
        availability_id = request.data.get('availability_id')
        
        if not availability_id:
            return Response(
                {'error': 'Both availability_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        # Verify the availability belongs to the user and matches the date
        availability = get_object_or_404(
            Availability,
            id=availability_id,
            staff=staff
        )
        if not availability:
            return Response({'error': 'You do not have any availability set for this day.'}, status=status.HTTP_404_NOT_FOUND)
        
        availability.delete()
        
        return Response({
            'message': 'Availability deleted successfully',
        }, status=status.HTTP_200_OK)
        
    except ValueError as e:
        return Response({'error': 'Invalid date format'}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)