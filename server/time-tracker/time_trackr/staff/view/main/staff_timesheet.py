from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from datetime import datetime, timedelta
from management.serializer import ShiftSerializer
from management.models import Shift
from management.view.main.decorators import staff_required
from management.models import Staff, TimeSheet
from django.shortcuts import get_object_or_404


@api_view(['GET'])
@permission_classes([IsAuthenticated])
@staff_required
def get_timesheet_data(request):
    """ Get the timesheet data for the user 
    Return the task serial, contract name, status, start time, end time, logged time """
    try:
        staff = get_object_or_404(Staff, user=request.user)
        timesheets = TimeSheet.objects.filter(staff=staff)
        
        if not timesheets.exists():
            return Response({'timesheets': []}, status=status.HTTP_200_OK)

        timesheet_data = []
        for timesheet in timesheets:
            try:
                timesheet_data.append({
                    'task_serial': timesheet.shift.task.task_serial,
                    'contract_name': timesheet.shift.task.contract.name,
                    'status': timesheet.status,
                    'start_time': timesheet.shift.start_time,
                    'end_time': timesheet.shift.end_time,
                    'task_start_time': timesheet.shift.task.start_time,
                    'start_date': timesheet.shift.task.start_date,
                })
            except AttributeError as e:
                print(f"Error processing timesheet {timesheet.id}: {str(e)}")
                continue

        return Response({'timesheets': timesheet_data}, status=status.HTTP_200_OK)
    
    except Staff.DoesNotExist:
        return Response(
            {'error': 'Staff profile not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        print(f"Unexpected error in get_timesheet_data: {str(e)}")
        return Response(
            {'error': 'An unexpected error occurred'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_ongoing_shift(request):
    """ Get the current ongoing shift for the user
     Return the time the shift started and the time the task is designed to end"""
    try:
        staff = get_object_or_404(Staff, user=request.user)
        shift = Shift.objects.filter(staff=staff, status='started').first()
        # If a shift is found, return the shift data
        shift_data = {
            'shift_start_time': shift.start_time,
            'task_end_time': shift.task.end_time,
        }
        
        return Response({'shift': shift_data}, status=status.HTTP_200_OK)
    except Exception as e:
        print(f"Unexpected error in get_ongoing_shift: {str(e)}")
        return Response(
            {'error': 'An unexpected error occurred'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
