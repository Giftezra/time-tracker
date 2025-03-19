from datetime import datetime, timedelta
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

from .decorators import admin_required

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
    Retrieves the list of employees that are:
    1. Available based on their availability schedule
    2. Not on leave
    3. Have no shifts assigned during the requested time period
    """
    try:
        # Get current_date from request params
        current_date_str = request.GET.get('current_date')
        if not current_date_str:
            return Response({'error': 'current_date parameter is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Parse the date string into datetime objects
        now = datetime.strptime(current_date_str, '%Y-%m-%d')
        later = now + timedelta(days=1)

        # Get the user company
        try:
            if hasattr(request.user, 'is_owner') and request.user.is_owner:
                company = get_object_or_404(Company, owner=request.user)
            elif hasattr(request.user, 'is_admin') and request.user.is_admin:
                staff_member = get_object_or_404(Staff, user=request.user)
                company = staff_member.company
            else:
                return Response({'error': 'User does not have a company'}, status=status.HTTP_400_BAD_REQUEST)
        except Company.DoesNotExist:
            return Response({'error': 'Company not found'}, status=status.HTTP_404_NOT_FOUND)

        # Get staff members who:
        # 1. Belong to the company
        # 2. Have availability set for this period
        # 3. Are not on leave
        # 4. Don't have shifts scheduled during this period
        available_users = Staff.objects.filter(
            company=company,
            staff_availability__availability_status='available'
        ).exclude(
            # Exclude staff who are on leave
            staff_leave__status__in=['pending', 'approved', 'on_leave'],
            staff_leave__start_date__lte=now.date(),
            staff_leave__end_date__gte=now.date()
        ).exclude(
            # Exclude staff who have shifts during this period
            shift_staff__status__in=['assigned', 'started'],
            shift_staff__task__start_date=now.date(),
            #shift_staff__task__end_date=later.date()
        ).distinct()
        print("Available users:", available_users)

        employee_list = [{
            'employee_name': staff.user.get_full_name(),
            'employee_id': staff.id,
        } for staff in available_users]

        return Response({'employees': employee_list}, status=status.HTTP_200_OK)
    
    except ValueError:
        return Response({'error': 'Invalid date format. Use YYYY-MM-DD'}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    



@api_view(['GET'])
@permission_classes([IsAuthenticated])
@admin_required
def get_all_employees_details(request):
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
def get_all_employees(request):
    """ This method will return a list of all employees in the company. 
     It will only return theier employee id and name """
    
    try:
        if request.user.is_owner:
            company = get_object_or_404(Company, owner=request.user)
        elif request.user.is_admin:
            staff_member = get_object_or_404(Staff, user=request.user)
            company = staff_member.company
        else:
            return Response({'error': 'You are not authorized to access this resource'}, status=status.HTTP_403_FORBIDDEN)
    except Company.DoesNotExist as e:
            return Response({'error': 'Company not found'}, status=status.HTTP_404_NOT_FOUND)
    
    try:
        staff_members = Staff.objects.filter(company=company)
        employee_list = [{
            'employee_id': staff.id,
            'employee_name': staff.user.get_full_name()
        } for staff in staff_members]
        print("Employee List:", employee_list)
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
        print("Shift details:", shift_details)
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

            
@api_view(['GET'])
@permission_classes([IsAuthenticated])
@admin_required
def get_employee_work_log(request):
    """Retrieves the employee's current or most recent work log. This will return only assigned or started shifts which are about to begin"""
    try:
        employee_id = request.GET.get('employee_id')
        if not employee_id:
            return Response({'error': 'Employee ID is required'}, status=status.HTTP_400_BAD_REQUEST)

        staff = get_object_or_404(Staff, id=employee_id)
        
        # Add debug logging
        print(f"Looking up shifts for employee ID: {employee_id}")
        
        # Get the most recent shift for this employee
        current_shift = Shift.objects.filter(
            staff=staff,
            status__in=['assigned', 'started'],
        ).order_by('-start_time').first()  # Add ordering to get the most recent shift

        # Return empty data instead of 404 when no shifts are found
        if not current_shift:
            return Response({
                'work_log': None,
                'message': 'No current or upcoming shifts found for this employee'
            }, status=status.HTTP_200_OK)

        work_log = {
            'id': current_shift.id,
            'name': staff.user.get_full_name(),
            'task_start_date': current_shift.task.start_date,
            'shift_start_time': current_shift.start_time,
            'task_start_time': current_shift.task.start_time,
            'task_end_time': current_shift.task.end_time,
            'status': current_shift.status
        }
        print("Work log:", work_log)
        return Response({'work_log': work_log}, status=status.HTTP_200_OK)
    
    except Exception as e:
        print(f"Error in get_employee_work_log: {str(e)}")
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@admin_required
def get_employee_task_details(request):
    """Retrieves the employee's task details"""
    try:
        employee_id = request.GET.get('employee_id')
        if not employee_id:
            return Response({'error': 'Employee ID is required'}, status=status.HTTP_400_BAD_REQUEST)

        staff = get_object_or_404(Staff, id=employee_id)
        # Get the total number of tasks the employee has selected
        selected_tasks = Task.objects.filter(selected_by=staff, status='selected')
        total_selected_tasks = selected_tasks.count()

        # Get the total number of tasks the employee has assigned to him
        assigned_tasks = Shift.objects.filter(staff=staff, status='assigned')
        total_assigned_tasks = assigned_tasks.count()

        # Get the total number of tasks the employee has completed
        completed_tasks = Shift.objects.filter(staff=staff, status='completed')
        total_completed_tasks = completed_tasks.count()

        # Get the total number of tasks the employee has cancelled
        cancelled_tasks = Shift.objects.filter(staff=staff, status='cancelled')
        total_cancelled_tasks = cancelled_tasks.count()

        # Calculate the total number of all task the employee has done or cancelled
        total_tasks = total_selected_tasks + total_assigned_tasks + total_completed_tasks + total_cancelled_tasks

        all_task_details = {
            'total_tasks': total_tasks,
            'total_selected_tasks': total_selected_tasks,
            'total_assigned_tasks': total_assigned_tasks,
            'total_completed_tasks': total_completed_tasks,
            'total_cancelled_tasks': total_cancelled_tasks
        }
        print("All task details:", all_task_details)
        return Response({'task_details': all_task_details}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@admin_required
def get_employee_with_id(request):
    """Retrieves the employee's details with the given id"""
    try:
        employee_id = request.GET.get('employee_id')
        if not employee_id:
            return Response({'error': 'Employee ID is required'}, status=status.HTTP_400_BAD_REQUEST)

        staff = get_object_or_404(Staff, id=employee_id)
        role = 'owner' if staff.user.is_owner else 'admin'

        employee_details = {
            'name': staff.user.get_full_name(),
            'email': staff.user.email,
            'phone': staff.user.phone,
            'dob': staff.user.dob,
            'role': role,
            'date_hired': staff.date_hired,
        }
        return Response({'employee_details': employee_details}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        
        
        
        




        # Get the total number of tasks the employee has selected

        
        

            
       