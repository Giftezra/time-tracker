""" The file contains the methods requested to manipulate and manage the employee data.
    The methods includes, get_all_employee, create_employee, update_employee, delete_employee, and search_employee.
    
"""
from datetime import datetime, timedelta
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

from .decorators import owner_required, staff_required, admin_required, superuser_required

from ...models import Task, User, Company, Shift
from ...serializer import UserSerializer, ShiftSerializer


from ...models import Company
from staff.models import Staff

""" Method is designed to retrieve all employees that are available and has no shift assigned to them in the next 24 hours."""
@api_view(['GET'])
@permission_classes([IsAuthenticated])
@admin_required
def get_available_employees(request):
    """ Method retrieves all employees that are available and has no shift assigned to them in the next 24 hours.
    The employees are returned in a list of dictionaries with the employee name and id."""
    try:
        # Check if the request user is an owner or staff
        if request.user.is_owner:
            company = get_object_or_404(Company, owner=request.user)
        elif request.user.is_admin:
            employee = get_object_or_404(Staff, user=request.user)
            company = employee.company
        else:
            return Response({'error': 'User does not have a company'}, status=status.HTTP_400_BAD_REQUEST)
        
        employee_list = [] # Create an empty list to hold the employee details
        # Create a time to simulate the next 24 hours
        now = datetime.now()
        later = now + timedelta(days=1)
        
        # Get all available staff members that are not on a shift in the next 24 hours
        staff = Staff.objects.filter(company=company)
        
        # Get all available user and check if they have a shift in the next 24 hours
        # Serialize the user and return the response
        
        available_user = staff.filter(availability__start_date__lte=now, availability__start_date__gte=later)
        available_staff = available_user.exclude(shift__start__gte=now, shift__start__lte=later)
        
        # Return the available employees as a list of dictionaries
        employee_list = [{
            'employee_name': available_staff.name,
            'employee_id' : available_staff.id
        }]
        return Response({'employees': employee_list}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    



@api_view(['GET'])
@permission_classes([IsAuthenticated])
@admin_required
def get_all_employees(request):
    """ Method gets all employees assoiciated witha a company .
    The method gets the employee using the company id associated with 
    the request user to indicate they all work for the same company.
    """
    try:
        # Check if the user is an owner or admin and get the company associated with the user
        if request.user.is_owner:
            company = get_object_or_404(Company, owner=request.user)
        elif request.user.is_admin:
            employee = get_object_or_404(Staff, user=request.user)
            company = employee.company
        else:
            return Response({'error': 'You are not authorized to access this resource'}, status=status.HTTP_403_FORBIDDEN)
        
        # Get all employees associated with the company and sort them by name
        staff_members = Staff.objects.filter(company=company)
        
        employee_list = []
        
        for staff in staff_members:
            # Get the user role
            role = 'admin' if staff.user.is_admin else 'staff'

            employee_list.append({
                'id': staff.id,
                'name': f'{staff.user.first_name} {staff.user.last_name}',  
                'email': staff.user.email,
                'phone': staff.user.phone,
                'role': role,
                'date_hired': staff.date_hired,
                'is_active': staff.user.is_active
            })
        return Response({'employees': employee_list}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    



@api_view(['GET'])
@permission_classes([IsAuthenticated])
@admin_required
def get_shift_details(request):
    # Validate the request data and throw an error if the data is not provided
    if not request.data:
        return Response({'error': 'User id is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    staff_id = request.data.get('staff_id')
    
    shift_details = []
    # Get the user's shifts that has been accepted by the user with the assigned status
    # and shift that has not yet been accepted by the user with the pending status
    # Get the task associated with the shift and retrieve the task details
    # Pass the details to the shift details list
    # return the shift details list
    try:
        staff = get_object_or_404(Staff, id=staff_id)
        shifts = Shift.objects.filter(staff=staff, status__in=['assigned', 'pending'])
        
        # Get all the tasks associated with the shifts
        for shift in shifts:
            task = shift.task # Get the task associated with the shift
            task_details = {
                'task': task.name,
                'task_serial': task.task_serial,
                'task_description': task.description,
                'start_time': task.start_time,
                'end_time': task.end_time,
                'start_date': task.start_date,
                'end_date': task.end_date,
                'staff_id': staff_id
            }
            shift_details.append(task_details)
        return Response({'shifts': shift_details}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    
    
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
@admin_required
def get_employee_complete_shifts(request):
    """ Method retrieves the total number of shifts completed by the employee."""

    # Validate the request data and throw an error if the data is not provided 
    if not request.data:
        return Response({'error': 'User id is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    staff_id = request.data.get('staff_id')

    staff = get_object_or_404(Staff, id=staff_id)
    # Get all the shifts completed by the employee
    shifts = Shift.objects.filter(staff=staff, status='completed')
    total = shifts.count()
    return Response({'total': total}, status=status.HTTP_200_OK)
            
       