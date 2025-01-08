""" The file contains the methods requested to manipulate and manage the employee data.
    The methods includes, get_all_employee, create_employee, update_employee, delete_employee, and search_employee.
    
"""
from datetime import datetime, timedelta
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

from .validation import owner_required, staff_required, admin_required, superuser_required

from ...models import Task, User, Company, Shift
from ...serializer import UserSerializer, ShiftSerializer


from ...models import Company

""" Method is designed to retrieve all employees that are available and has no shift assigned to them in the next 24 hours."""
@api_view(['GET'])
@permission_classes([IsAuthenticated])
@admin_required
def get_available_employees(request):
    try:
        employee_list = []
        # Get current time and 24 hour 
        now = datetime.now()
        later = now + timedelta(days=1)
        
        # filter the users based on the company associated with the request user
        company = request.user.company
        user = User.objects.filter(company=company)
        
        # Get all available user and check if they have a shift in the next 24 hours
        # Serialize the user and return the response
        
        available_user = user.filter(availability__start_date__lte=now, availability__start_date__gte=later)
        available_staff = available_user.exclude(shift__start__gte=now, shift__start__lte=later)
        
        employee_list = [{
            'employee_name': available_staff.name,
            'employee_id' : available_staff.id
        }]
        return Response({'employees': employee_list}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    


""" Method gets all employees assoiciated witha a company .
    The method gets the employee using the company id associated with 
    the request user to indicate they all work for the same company.
    
"""
@api_view(['GET'])
@permission_classes([IsAuthenticated])
@admin_required
def get_all_employees(request):
    try:
        company = request.user.company
        # Get all employees associated with the company and sort them by name
        users = User.objects.filter(company=company).order_by('first_name')
        
        employee_list = []
        
        for user in users:
            if user.is_owner:
                role = 'Owner'
            elif user.is_admin:
                role = 'Admin'
            else:
                role = 'Staff'
            
            employee_list.append({
                'id': user.id,
                'name': user.first_name + ' ' + user.last_name,
                'email': user.email,
                'phone': user.phone,
                'role': role,
                'date_hired': user.date_hired,
                'is_active': user.is_active
            })
        return Response({'employees': employee_list}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
""" Given the user id method checks if the user has any shifts starting in the next 24 hours.
A for loop is used to iterate through the shifts and get the task associated with the shift.
Uses an array to store the shift details and returns the array as a response.

"""
@api_view(['GET'])
@permission_classes([IsAuthenticated])
@admin_required
def get_shift_details(request):
    # Validate the request data and throw an error if the data is not provided
    if not request.data:
        return Response({'error': 'User id is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    user_id = request.data.get('staff_id')
    
    shift_details = []
    # Get the user's shifts that has been accepted by the user with the assigned status
    # and shift that has not yet been accepted by the user with the pending status
    # Get the task associated with the shift and retrieve the task details
    # Pass the details to the shift details list
    # return the shift details list
    try:
        user = get_object_or_404(User, id=user_id)
        shifts = Shift.objects.filter(user=user, status__in=['assigned', 'pending'])
        
        for shift in shifts:
            task = shift.task
            task_details = {
                'task': task.name,
                'task_serial': task.serial,
                'task_description': task.description,
                'start_time': task.start_time,
                'end_time': task.end_time,
                'start_date': task.start_date,
                'end_date': task.end_date,
                'staff_id': user_id
            }
            shift_details.append(task_details)
        return Response(shift_details, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    
    
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
@admin_required
def get_employee_complete_shifts(request):
    """ Method retrieves the total number of shifts completed by the user."""
    # Validate the request data and throw an error if the data is not provided 
    if not request.data:
        return Response({'error': 'User id is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    staff_id = request.data.get('staff_id')
    staff = get_object_or_404(User, id=staff_id)
    task = Task.objects.filter(user=staff, status='completed')
    total = task.count()
    return Response({'total': total}, status=status.HTTP_200_OK)
            
       