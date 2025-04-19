from datetime import datetime, timedelta
from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import get_object_or_404
from .decorators import admin_required
from management.models import Task, Company, Shift, User, Identity
from management.models import Staff
from datetime import datetime, timedelta
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django_ratelimit.decorators import ratelimit
from django.core.cache import cache
from django.conf import settings
from management.helpers import get_cache_key


@api_view(['GET'])
@permission_classes([IsAuthenticated])
@admin_required
@ratelimit(key='user', rate='10/m', block=True, method=['GET'])
def employee_display(request):
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
        # Get the cache key for the employees list
         # Return the employees list from cache if it exists 
        cache_key = get_cache_key('employees_list', company.id)
        cache_data = cache.get(cache_key)
        if cache_data:
            return Response({'employee_list': cache_data}, status=status.HTTP_200_OK)
        
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
        # Cache the employees list for 1 hour
        cache.set(cache_key, employee_list, timeout=settings.CACHE_TIMEOUT)
        return Response({'employee_list': employee_list}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@admin_required
@ratelimit(key='user', rate='10/m', block=True, method=['GET'])
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
    # Get the cache key for the employees list
    cache_key = get_cache_key('employees_list', company.id)
    cache_data = cache.get(cache_key)
    if cache_data:
        return Response({'employees': cache_data}, status=status.HTTP_200_OK)
    
    try:
        staff_members = Staff.objects.filter(company=company)
        employee_list = [{
            'employee_id': staff.id,
            'employee_name': staff.user.get_full_name()
        } for staff in staff_members]
        # Cache the employees list for 1 hour
        cache.set(cache_key, employee_list, timeout=settings.CACHE_TIMEOUT)

        return Response({'employees': employee_list}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@admin_required
@ratelimit(key='user', rate='10/m', block=True, method=['GET'])
def get_employee_analytics(request):
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
        # Get the cache key for the employees list
        cache_key = get_cache_key('employees_details', company.id, employee_id)
        cache_data = cache.get(cache_key)
        if cache_data:
            return Response({'employees': cache_data}, status=status.HTTP_200_OK)
        
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
        # Cache the employee details for 1 hour
        cache.set(cache_key, employee_data, timeout=settings.CACHE_TIMEOUT)
        return Response({'employee_data': employee_data}, status=status.HTTP_200_OK)
    except Staff.DoesNotExist as e:
        return Response({'error': 'Employee not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
@admin_required
@ratelimit(key='user', rate='10/m', block=True, method=['GET'])
def get_shift_details(request):
    # Validate the request data and throw an error if the data is not provided
    if not request.data:
        return Response({'error': 'User id is required'}, status=status.HTTP_400_BAD_REQUEST)
    staff_id = request.data.get('staff_id')

    shift_details = []
    # Get the cache key for the shift details
    # Return the shift details from cache if it exists
    cache_key = get_cache_key('shift_details', staff_id)
    cache_data = cache.get(cache_key)
    if cache_data:
        return Response({'shifts': cache_data}, status=status.HTTP_200_OK)
    
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
        # Cache the shift details for 1 hour
        cache.set(cache_key, shift_details, timeout=settings.CACHE_TIMEOUT)
        return Response({'shifts': shift_details}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
@admin_required
@ratelimit(key='user', rate='10/m', block=True, method=['GET'])
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
@ratelimit(key='user', rate='10/m', block=True, method=['GET'])
def get_employee_work_log(request):
    """Retrieves the employee's current or most recent work log. This will return only assigned or started shifts which are about to begin"""
    try:
        employee_id = request.GET.get('employee_id')
        if not employee_id:
            return Response({'error': 'Employee ID is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Get the cache key for the employee work log
        # Get the employee work log from cache if it exists in the cache
        cache_key = get_cache_key('employee_work_log', employee_id)
        cache_data = cache.get(cache_key)
        if cache_data:
            return Response({'work_log': cache_data}, status=status.HTTP_200_OK)

        staff = get_object_or_404(Staff, id=employee_id)
        
        # Add debug logging
        print(f"Looking up shifts for employee ID: {employee_id}")
        
        # Get the most recent shift for this employee
        # Get only the assigned or started shifts
        # Add ordering to get the most recent shift which is the first shift in the list
        current_shift = Shift.objects.filter(
            staff=staff,
            status__in=['assigned', 'started'],
        ).order_by('-start_time').first()

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
        # Cache the employee work log for 5 minutes
        cache.set(cache_key, work_log, timeout=settings.CACHE_TIMEOUT)
        return Response({'work_log': work_log}, status=status.HTTP_200_OK)
    
    except Exception as e:
        print(f"Error in get_employee_work_log: {str(e)}")
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@admin_required
@ratelimit(key='user', rate='10/m', block=True, method=['GET'])
def get_employee_task_details(request):
    """Retrieves the employee's task details"""
    try:
        employee_id = request.GET.get('employee_id')
        if not employee_id:
            return Response({'error': 'Employee ID is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Get the cache key for the employee task details
        cache_key = get_cache_key('employee_task_details', employee_id)
        cache_data = cache.get(cache_key)
        if cache_data:
            return Response({'task_details': cache_data}, status=status.HTTP_200_OK)

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
        # Cache the employee task details for 5 minutes
        cache.set(cache_key, all_task_details, timeout=settings.CACHE_TIMEOUT)
        return Response({'task_details': all_task_details}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@admin_required
@ratelimit(key='user', rate='10/m', block=True, method=['GET'])
def get_employee_with_id(request):
    """Retrieves the employee's details with the given id.
    First try to get the data from cache before querying the database if the data is not cached."""

    try:
        employee_id = request.GET.get('employee_id')
        if not employee_id:
            return Response({'error': 'Employee ID is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Get the cache key for the employee details
        cache_key = get_cache_key('employee_details', employee_id)
        cache_data = cache.get(cache_key)
        if cache_data:
            return Response({'employee_details': cache_data}, status=status.HTTP_200_OK)

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
        # Cache the employee details for 1 hour
        cache.set(cache_key, employee_details, timeout=settings.CACHE_TIMEOUT)
        return Response({'employee_details': employee_details}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
  

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@admin_required
@ratelimit(key='user', rate='50/h', block=True, method=['POST'])
def onboard_employee(request):
    """ Create an employee based on the roles provided from the client.
    After creating the employee, send an email to the user using celery to send the email in the background """
    
    if not request.data:
        return Response({'error': 'Please provide the user details'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Get company based on user role
    if request.user.is_owner:
        company = get_object_or_404(Company, owner=request.user)
    else:
        # If the request user is not an owner, get the company through the staff relationship
        company = get_object_or_404(Staff, user=request.user).company
    
    try:
        required_fields = ['first_name', 'last_name', 'email', 'phone', 'password', 'dob', 'role','address','city','postcode','country']
        
        # Add debug logging for missing fields
        missing_fields = [field for field in required_fields if not request.data.get(field)]
        if missing_fields:
            print("Missing fields:", missing_fields)
            return Response({'error': f'Missing required fields: {", ".join(missing_fields)}'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        # Create the validated data
        validated_data = {
            'first_name': request.data.get('first_name'),
            'last_name': request.data.get('last_name'),
            'email': request.data.get('email'),
            'phone': request.data.get('phone'),
            'password': request.data.get('password'),
            'dob': request.data.get('dob'),
            'address': request.data.get('address'),
            'city': request.data.get('city'),
            'postcode': request.data.get('postcode'),
            'country': request.data.get('country')
        }
        
        # Add debug logging
        print("Validated data:", validated_data)
        
        role = request.data.get('role')
        print("Role:", role)
        
        # Use the role to direct the object creation
        # Create admin if role is admin and staff if role is staff
        # Return the valid responses
        if role == 'admin':
            user = User.objects.create_admin(
                first_name=validated_data['first_name'],
                last_name=validated_data['last_name'],
                email=validated_data['email'],
                phone=validated_data['phone'],
                password=validated_data['password'],
                dob=validated_data['dob'],
                address=validated_data['address'],
                city=validated_data['city'],
                postcode=validated_data['postcode'],
                country=validated_data['country'],
                company=company
            )
            return Response({'message': 'Admin created successfully'}, status=status.HTTP_201_CREATED)
            
        elif role == 'staff':
            user = User.objects.create_staff(
                first_name=validated_data['first_name'],
                last_name=validated_data['last_name'],
                email=validated_data['email'],
                phone=validated_data['phone'],
                password=validated_data['password'],
                dob=validated_data['dob'],
                address=validated_data['address'],
                city=validated_data['city'],
                postcode=validated_data['postcode'],
                country=validated_data['country'],
                company=company
            )
            return Response({'message': 'Staff created successfully'}, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        print(f"Error creating user: {str(e)}")  # Add debug logging
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
@admin_required
@ratelimit(key='user', rate='50/h', block=True, method=['DELETE'])
def remove_employee(request):
    """Remove an employee from the database"""
    try:
        # Get the employee id from the server request or return an error if the employee id is not provided
        # If the employee id is provided, get the employee from the database and delete the employee
        employee_id = request.GET.get('employee_id')
        print(f"Employee ID: {employee_id}")
        if not employee_id:
            return Response({'error': 'Employee ID is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        employee = get_object_or_404(Staff, id=employee_id)
        employee.delete()
        return Response({'message': 'Employee removed successfully'}, status=status.HTTP_200_OK)
    except Staff.DoesNotExist:
        return Response({'error': 'Employee not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
            

            
       