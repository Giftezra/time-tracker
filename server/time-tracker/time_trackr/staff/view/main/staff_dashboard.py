from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from management.view.main.decorators import staff_required
from staff.models import Staff
from management.models import Shift
from django_ratelimit.decorators import ratelimit
from django.core.cache import cache
from management.helpers import get_cache_key
from django.db.models import Count
from django.db.models.functions import ExtractMonth
import datetime
from django.conf import settings
    


@api_view(['GET'])
@permission_classes([IsAuthenticated])
@staff_required
@ratelimit(key='user', rate='10/h', block=True)
def get_staff_dashboard_data(request):
    """Get the completed shift data including total hours and earnings, and pending shifts"""
    try:
        staff = Staff.objects.get(user=request.user.id)
        cache_key = get_cache_key(request.user.id, 'staff_dashboard_data')
        cached_data = cache.get(cache_key)
        if cached_data:
            return Response({'shift_data': cached_data}, status=status.HTTP_200_OK)
        
        # Get shifts where this staff member is explicitly assigned
        year = datetime.datetime.now().year
        shifts = Shift.objects.filter(staff=staff, end_date__year=year)
        
        if not shifts.exists():  # Use exists() instead of checking the queryset directly
            return Response({'shift_data': {
                'total_shifts': 0,
                'total_hours': 0,
                'total_earnings': 0,
                'completed_shifts': 0,
                'cancelled_shifts': 0
            }}, status=status.HTTP_404_NOT_FOUND)
        print('shift with 0', shifts.count())
        
        completed_shifts = shifts.filter(status='completed')
        cancelled_shifts = shifts.filter(status='cancelled')
        
        total_hours = 0
        total_earnings = 0
        
        # Calculate completed shifts statistics
        for shift in completed_shifts:
            if shift.start_time and shift.end_time and shift.start_date and shift.end_date:
                # Create datetime objects for start and end times
                start_datetime = datetime.datetime.combine(shift.start_date, shift.start_time)
                end_datetime = datetime.datetime.combine(shift.end_date, shift.end_time)
                
                # Calculate duration
                duration = end_datetime - start_datetime
                hours = duration.total_seconds() / 3600  # Convert to hours
                total_hours += hours
                
                hourly_rate = shift.task.amount
                shift_earnings = hours * float(hourly_rate)
                total_earnings += shift_earnings

        shift_data = {
            'total_shifts': shifts.count(), 
            'total_hours': round(total_hours, 2),
            'total_earnings': round(total_earnings, 2),
            'completed_shifts': completed_shifts.count(),
            'cancelled_shifts': cancelled_shifts.count(),
        }

        cache.set(cache_key, shift_data, timeout=settings.CACHE_TIMEOUT) # cache the data for 5 minutes
        return Response({'shift_data': shift_data}, status=status.HTTP_200_OK)
    except Staff.DoesNotExist:
        return Response({
            'message': 'Staff profile not found'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print('error', e)
        return Response({
            'message': f'An error occurred: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@staff_required
@ratelimit(key='user', rate='10/h', block=True)
def get_staff_growth_statistics(request):
    """Get monthly statistics showing staff's completed shifts count"""
    try:
        # Get the year from query params or use current year
        try:
            year = datetime.datetime.now().year
        except ValueError:
            return Response({
                'error': 'Invalid year parameter'
            }, status=status.HTTP_400_BAD_REQUEST)

        staff = Staff.objects.get(user=request.user)
        
        # Get monthly counts for completed shifts
        shifts_by_month = Shift.objects.filter(
            staff=staff,
            status='completed',
            end_date__year=year
        ).annotate(
            month=ExtractMonth('end_date')
        ).values('month').annotate(
            count=Count('id')
        )

        # Convert to the format needed by the frontend
        months = {
            1: 'Jan', 2: 'Feb', 3: 'Mar', 4: 'Apr', 5: 'May', 6: 'Jun',
            7: 'Jul', 8: 'Aug', 9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dec'
        }

        statistics = []
        for month_num in range(1, 13):
            count = next(
                (item['count'] for item in shifts_by_month if item['month'] == month_num),
                0
            )
            statistics.append({
                'value': count,
                'label': months[month_num],
                'spacing': 2,
                'labelWidth': 30 if months[month_num] in ['Mar', 'Apr', 'Sept', 'Oct'] else 20,
                'frontColor': '#177AD5'
            })

        return Response({
            'statistics': statistics,
            'year': year
        }, status=status.HTTP_200_OK)

    except Staff.DoesNotExist:
        return Response({
            'error': 'Staff profile not found'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

    

