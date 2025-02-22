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
from datetime import datetime, timedelta
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from management.models import Staff, Company, Shift

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@admin_required
def get_available_employees(request):
    """ 
     This method signature is designed to retrieve the list of employees that are available and has no shift assigned to them in the next 24 hours.
     The method uses the @admin_required decorator to check if the user is an admin or owner before allowing them access to the method.

    """
    try:
        # Get the user company based on the user role else return the user is not authorized to access the resource
        try:
            if hasattr(request.user, 'is_owner') and request.user.is_owner:
                company = get_object_or_404(Company, owner=request.user)
            elif hasattr(request.user, 'is_admin') and request.user.is_admin:
                staff_member = get_object_or_404(Staff, user=request.user)
                company = staff_member.company
            else:
                return Response({'error': 'User does not have a company'}, status=status.HTTP_400_BAD_REQUEST)
        except Company.DoesNotExist as e:
            return Response({'error': 'Company not found'}, status=status.HTTP_404_NOT_FOUND)
        
        # Get the current date and the date 24 hours from now
        now = datetime.now()
        later = now + timedelta(days=1)

        # Get staff members who have availability but are not scheduled for a shift
        available_user = Staff.objects.filter(
            company=company,
            staff_availability__start_date__lte=now.date(),
            staff_availability__end_date__gte=later.date()
        ).exclude(
            shift_staff__start_time__gte=now,
            shift_staff__start_time__lte=later
        ).distinct()

        employee_list =[]
        for staff in available_user:
            employee_list.append({
                'employee_name': staff.user.get_full_name(),
                'employee_id': staff.id
            })

        return Response({'employees': employee_list}, status=status.HTTP_200_OK)
    
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    



@api_view(['GET'])
@permission_classes([IsAuthenticated])
@admin_required
def get_all_employees(request):
    """ Method gets all employees associated with a company.
    The method gets the employee using the company id associated with 
    the request user to indicate they all work for the same company.
    """
    try:
        try:
            # Check if the user is an owner or admin and get the company associated with the user
            if request.user.is_owner:
                company = get_object_or_404(Company, owner=request.user)
            elif request.user.is_admin:
                employee = get_object_or_404(Staff, user=request.user)
                company = employee.company
            else:
                return Response({'error': 'You are not authorized to access this resource'}, status=status.HTTP_403_FORBIDDEN)
        except Company.DoesNotExist as e:
            return Response({'error': 'Company not found'}, status=status.HTTP_404_NOT_FOUND)
        
        # Get all employees associated with the company and sort them by name
        staff_members = Staff.objects.filter(company=company)
        
        employee_list = []
        for staff in staff_members:
            # Get the user role
            role = 'admin' if staff.user.is_admin else 'staff'

            employee_list.append({
                'id': staff.id,
                'name': staff.user.get_full_name(),  
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
def get_employee_details(request):
    """ The method is used to retrieve the details of a single employee, given the employee id sent from the client """
    try:
        # Get the company of the request user
        try:
            if request.user.is_owner:
                company = get_object_or_404(Company, owner=request.user)
            elif request.user.is_admin:
                staff = get_object_or_404(Staff, user=request.user)
                company = staff.company
            else:
                return Response({'error': 'You are not authorized to access this resource'}, status=status.HTTP_403_FORBIDDEN)
        except Company.DoesNotExist as e:
            return Response({'error': 'Company not found'}, status=status.HTTP_404_NOT_FOUND)
        
        # Get the employee id from the request data and retrieve the employee details
        employee_id = request.query_params.get('employee_id')
        staff = get_object_or_404(Staff, id=employee_id)

        # Calculate the total number of shifts completed by the employee
        shifts = Shift.objects.filter(staff=staff, status='completed')
        total_shifts = shifts.count()
         
        # Calculate the total number of hours they have worked
        total_hours = 0
        for shift in shifts:
            total_hours += shift.start_time - shift.end_time

        # Calculate the total number of shifts they have missed or cancelled
        cancelled_shifts = Shift.objects.filter(staff=staff, status='cancelled').count()

        # Check the total number of tasks the user has seleceted to complete himself 
        # Check the total number of tasks the use has been assigned to complete
        unassigned_tasks = shift.task.filter(status='selected').count()
        assigned_task = shift.task.filter(status='assigned').count()

        # Get the user role
        role = 'admin' if staff.user.is_admin else 'staff'
        employee_data = {
            'role': role,
            'name': staff.user.get_full_name(),
            'email': staff.user.email,
            'phone': staff.user.phone,
            'date_hired': staff.date_hired,
            'dob': staff.user.dob,
            'department': role,
            'total_number_of_projects_completed': total_shifts,
            'total_hours_worked': total_hours,
            'total_cancellations': cancelled_shifts,
            'number_of_unassigned_tasks':unassigned_tasks,
            'number_of_assigned_tasks': assigned_task,
        }
        return Response({'employee_data': employee_data}, status=status.HTTP_200_OK)
    except Staff.DoesNotExist as e:
        return Response({'error': 'Employee not found'}, status=status.HTTP_404_NOT_FOUND)
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
        shifts = Shift.objects.filter(staff=staff, status__in=['assigned', 'started'])
        
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
            
       