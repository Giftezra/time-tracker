from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from management.view.main.decorators import staff_required
from staff.models import Staff
from management.models import Shift

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@staff_required
def get_active_shift_data(request):
    """Get the current active shift data for the authenticated staff member.
    
    Returns:
        - Contract name
        - Shift start time
        - Task end time
        - Task name/description
        - Shift duration (if needed)
    """
    try:
        staff = Staff.objects.get(user=request.user.id)
        shift = Shift.objects.filter(staff=staff, status='started')

        if shift.exists():
            current_shift = shift.first()
            shift_data = {
                'contract_name': current_shift.task.contract.name,
                'shift_start_time': current_shift.start_time,
                'task_end_time': current_shift.task.end_time,
            }
            print('shift_data', shift_data)
            return Response({'shift_data': shift_data}, status=status.HTTP_200_OK)
        
        else:
            return Response({
                'message': 'No active shift found'
            }, status=status.HTTP_404_NOT_FOUND)
        
    except Staff.DoesNotExist:
        return Response({
            'message': 'Staff profile not found'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            'message': f'An error occurred: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@staff_required
def get_completed_shifts(request):
    """Get the completed shift data including total hours and earnings, and pending shifts"""
    try:
        staff = Staff.objects.get(user=request.user.id)
        print('staff', staff)
        completed_shifts = Shift.objects.filter(staff=staff, status='completed')
        pending_shifts = Shift.objects.filter(staff=staff, status='assigned')
        
        total_hours = 0
        total_earnings = 0
        pending_tasks_data = 0 
        
        # Calculate completed shifts statistics
        for shift in completed_shifts:
            duration = shift.end_time - shift.start_time
            hours = duration.total_seconds() / 3600  # Convert to hours
            total_hours += hours
            
            hourly_rate = shift.task.amount
            shift_earnings = hours * float(hourly_rate)
            total_earnings += shift_earnings

        # Get pending tasks details
        for shift in pending_shifts:
            pending_tasks_data += 1

        shift_data = {
            'total_shifts': completed_shifts.count(),
            'total_hours': round(total_hours, 2),
            'total_earnings': round(total_earnings, 2),
            'pending_tasks': pending_tasks_data
        }
        
        return Response({'shift_data': shift_data}, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'message': f'An error occurred: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

