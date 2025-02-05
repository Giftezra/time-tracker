from rest_framework.decorators import api_view, permission_classes  
from rest_framework.permissions import IsAuthenticated
from ...models import User,Company,Shift
from ...serializer import UserSerializer

from .decorators import admin_required

from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import status
from staff.models import Staff

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@admin_required
def get_shifts(request):
    try:
        # Check if the user is an admin or the owner and get the company associated with the user
        if request.user.is_owner:
            company = get_object_or_404(Company, owner=request.user)
        elif request.user.is_admin:
            employee = get_object_or_404(Staff, user=request.user)
            company = employee.company
        else:
            return Response({'error': 'You are not authorized to access this resource'}, status=status.HTTP_403_FORBIDDEN)
            
        # Get all contracts and tasksassociated with the company using the filter method to filter the associated company shifts.
        shifts = Shift.objects.filter(task__contract__company=company)
        
        if not shifts:
            return Response({'error': 'No shifts found'}, status=status.HTTP_404_NOT_FOUND)
        
        shift_list = []
        
        # Append the details of each shift to the shift list
        for shift in shifts:
            # Get the employees assigned to a task
            employees = shift.staff.all()
            for employee in employees:
                shift_list.append({
                    'shiftId':shift.id,
                    'employeeId':employee.id,
                    'startdate' : shift.task.start_date,
                    'enddate' : shift.task.end_date,
                    'starttime': shift.task.start_time,
                    'endtime': shift.task.end_time,
                    'status': shift.status,
                    'tast_serial' : shift.task.task_serial,
                    'client': shift.task.contract.client.name,
                })
        return Response({'shifts': shift_list}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)