from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt

from .decorators import admin_required
from ...models import User, Task, Shift, Contracts, Client, User

from datetime import datetime, timedelta
from django.utils import timezone

from staff.models import Availability, Staff
from management.models import Company
from staff.models import Leave



""" Create a new Task and save it to the database.
Each task is created with a client, contract, task serial, description, start date, end date, start time, end time, amount, created by, and status.
  """
@api_view(['POST'])
@permission_classes([IsAuthenticated])
@admin_required
def create_task(request):
    if not request.data:
        return Response({'error': 'Please provide task details'}, status=status.HTTP_400_BAD_REQUEST)
    
    data = request.data.get('data', {})
    
    try:
        # Validate required fields
        required_fields = ['contract_id', 'start_time', 'end_time', 'dates', 'amount', 'task_serial', 'description']
        for field in required_fields:
            if not data.get(field):
                return Response({'error': f'{field} is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        contract = get_object_or_404(Contracts, id=data['contract_id'])
        
        # Create the task
        task = Task.objects.create(
            contract=contract,
            task_serial=data['task_serial'],
            description=data['description'],
            start_date=data['dates'][0],  # First date
            end_date=data['dates'][-1],   # Last date
            start_time=f"{data['start_time']['hours']}:{data['start_time']['minutes']}",
            end_time=f"{data['end_time']['hours']}:{data['end_time']['minutes']}",
            amount=data['amount'],
            created_by=request.user,
            status='pending'
        )
        
        return Response({
            'message': 'Task created successfully',
            'task_id': task.id
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@admin_required
def create_shift(request):
    if not request.data:
        return Response({'error': 'Please provide shift details'}, status=status.HTTP_400_BAD_REQUEST)
    
    data = request.data.get('data', {})
    
    try:
        # Create task first
        task_response = create_task(request)
        if task_response.status_code != status.HTTP_201_CREATED:
            return task_response
        
        task = Task.objects.get(id=task_response.data['task_id'])
        
        # Now create shifts for each employee
        employee_ids = data.get('employee_id', [])
        if not employee_ids:
            return Response({'error': 'At least one employee must be selected'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        successful_assignments = []
        failed_assignments = []
        
        for emp_id in employee_ids:
            try:
                employee = Staff.objects.get(id=emp_id)
                
                # Check for availability and create shift
                shift = Shift.objects.create(
                    task=task,
                    status='pending',
                    created_by=request.user
                )
                shift.staff.add(employee)
                successful_assignments.append(emp_id)
                
            except Exception as e:
                failed_assignments.append({
                    'employee_id': emp_id,
                    'error': str(e)
                })
        
        return Response({
            'message': 'Shift created successfully',
            'successful_assignments': successful_assignments,
            'failed_assignments': failed_assignments
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@admin_required
def get_all_contracts(request):
    if request.method == 'OPTIONS':
        return Response(status=status.HTTP_204_NO_CONTENT)


    contract_list = []
    try:
        # Get the company object associated with the request user 
        # Check if the user is an owner or an admin
        # If the user is an owner, get the company object associated with the owner
        # If the user is an admin, get the company object associated with the staff
        # If the user is not associated with any company, return an error
        try:
           if request.user.is_owner:
              company = get_object_or_404(Company, owner=request.user)
           elif request.user.is_admin:
              company = get_object_or_404(Staff, user=request.user).company
           else:
              return Response({'error': 'User is not associated with any company'}, status=status.HTTP_400_BAD_REQUEST)
        except Company.DoesNotExist:
            return Response({'error': 'No company found for user'}, status=status.HTTP_404_NOT_FOUND) 

        # Get all the clients associated with the company 
        clients = Client.objects.filter(company=company)
        # Get all the contracts associated with the clients and that are not completed
        contracts = Contracts.objects.filter(client__in=clients, is_completed=False)


        if not contracts.exists():
            return Response(
                {'contract_list': []},  # Return empty list instead of error
                status=status.HTTP_200_OK
            )

        for contract in contracts:
            contract_list.append({
                'client_name': contract.client.name,
                'contract_id': contract.id,
                'contract_name': contract.name,
                'contract_address': contract.address,
                'contract_postcode': contract.postcode,
                'contract_city': contract.city,
            })
        return Response({'contract_list': contract_list}, status=status.HTTP_200_OK)
        
    except Exception as e:
        print(f"Error in get_all_contracts: {str(e)}")  # Add server-side logging
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
@admin_required
def get_all_open_task(request):
  unassigned_tasks = []
  # Retrieve the company from the request user
  try:
    try:
      # Get the company based on the user role
      if request.user.is_owner:
        company = get_object_or_404(Company, owner=request.user)
      elif request.user.is_admin:
        company = get_object_or_404(Staff, user=request.user).company
      else:
        return Response({'error': 'User is not associated with any company'}, status=status.HTTP_400_BAD_REQUEST)
    except Company.DoesNotExist:
      return Response({'error': 'No company found for user'}, status=status.HTTP_404_NOT_FOUND)

    # Get all clients associated with the company
    # Get all contracts associated with the clients
    # Get all tasks associated with the contracts that are not completed
    tasks = Task.objects.filter(
        contract__client__company=company,
        status__in=['pending', 'assigned', 'selected']  # Include all non-completed statuses
    )
    
    for task in tasks:
      unassigned_tasks.append({
        'task_id': task.id,
        'contract_name': task.contract.name,
        'task_serial': task.task_serial,
        'task_description': task.description,
        'contract_address': task.contract.address,
        'contract_postcode': task.contract.postcode,
        'task_start_date': task.start_date,
        'task_end_date': task.end_date,
        'created_by': task.created_by.get_full_name(),
        'created_at': task.created_at,
      })
    return Response({'unassigned_tasks': unassigned_tasks}, status=status.HTTP_200_OK)
  except Task.DoesNotExist:
    return Response({'error': 'No tasks found'}, status=status.HTTP_400_BAD_REQUEST)
  except Exception as e:
    return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
  
  
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
@admin_required
def assign_task(request):
    """This method handles assigning a task to multiple staff members."""
    if not request.data:
        return Response({'error': 'Please provide the task details'}, status=status.HTTP_400_BAD_REQUEST)
    
    staff_ids = request.data.get('staff_ids', [])  # Expect an array of staff IDs
    task_id = request.data.get('task_id')
    # Return an error if no staff ids are provided
    if not staff_ids:
        return Response({'error': 'Please select at least one staff member'}, status=status.HTTP_400_BAD_REQUEST)
    

    try:
        task = get_object_or_404(Task, id=task_id)
        
        # Check if task is already assigned
        if task.status == 'assigned':
            return Response(
                {'error': 'Task is already assigned'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        successfully_assigned = []
        failed_assignments = []

        # Iterate through the staff ids and assign the task to each staff
        # Check if the staff is on leave during the task period
        # Check if the staff is available during the task period
        # Create a new shift and assign the task to the staff
        # Update the staff availability for the task duration
        for staff_id in staff_ids:
            try:
                staff = get_object_or_404(Staff, id=staff_id)

                # Check if staff is on leave during the task period
                leave_exists = Leave.objects.filter(
                    staff=staff,
                    start_date__lte=task.end_date,
                    end_date__gte=task.start_date,
                    status__in=['pending', 'approved', 'on_leave']
                ).exists()

                # Check if staff is available during the task period
                availability = Availability.objects.filter(
                    staff=staff,
                    start_date__lte=task.start_date,
                    end_date__gte=task.end_date,
                    start_time__lte=task.start_time,
                    end_time__gte=task.end_time,
                    availability_status='available'
                ).first()

                if not availability or leave_exists:
                    failed_assignments.append({
                        'staff_id': staff_id,
                        'reason': 'Staff is not available during the task period'
                    })
                    continue

                # Create the shift and assign the task
                shift = Shift.objects.create(
                    task=task,
                    status='pending',
                    created_by=request.user
                )
                shift.staff.add(staff)
                shift.save()

                # Update staff availability for the task duration
                new_unavailability = Availability.objects.create(
                    staff=staff,
                    start_date=task.start_date,
                    end_date=task.end_date,
                    start_time=task.start_time,
                    end_time=task.end_time,
                    availability_status='unavailable',
                    note=f'Assigned to task {task.task_serial}'
                )
                new_unavailability.save()

                successfully_assigned.append(staff_id)

            except Staff.DoesNotExist:
                failed_assignments.append({
                    'staff_id': staff_id,
                    'reason': 'Staff not found'
                })

        if successfully_assigned:
            # Update task status only if at least one assignment was successful
            task.status = 'assigned'
            task.save()

        return Response({
            'success': True,
            'message': 'Task assignment complete',
            'successfully_assigned': successfully_assigned,
            'failed_assignments': failed_assignments
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_400_BAD_REQUEST
        )
      
      

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@admin_required
def get_active_tasks(request):
    """Retrieve all active (ongoing) shifts, returning a separate entry for each assigned staff."""
    try:
        # Get the company object based on the user role
        if hasattr(request.user, 'is_owner') and request.user.is_owner:
            company = get_object_or_404(Company, owner=request.user)
        elif hasattr(request.user, 'is_admin') and request.user.is_admin:
            staff_member = get_object_or_404(Staff, user=request.user)
            company = staff_member.company
        else:
            return Response({'error': 'User is not associated with any company'}, status=status.HTTP_400_BAD_REQUEST)

        # Get all active (started) shifts for the company
        shifts = Shift.objects.filter(task__contract__client__company=company, status='started')

        shift_data = []

        for shift in shifts:
            # Create a separate entry for each employee assigned to the shift
            for employee in shift.staff.all():
                shift_data.append({
                    'shift_id': shift.id,
                    'task_serial': shift.task.task_serial,
                    'contract_name': shift.task.contract.name,
                    'employee_id': employee.id,
                    'employee_name': employee.user.get_full_name(),
                    'start_time': shift.start_time,
                })

        return Response({'active_shifts': shift_data}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
@admin_required
def terminate_shift(request):
    """ Terminate the shift given the shift id.
    This can only be performed by users with at least the admin role.
    The shift is retrieved using the shift id which is gotten from the request data.
    The shift status is updated to completed.
    """
    shift_id = request.data.get('shift_id')
    employee_id = request.data.get('employee_id')
    
    # Validate required fields
    if not shift_id or not employee_id:
        return Response(
            {'error': 'shift_id and employee_id are required'}, 
            status=status.HTTP_400_BAD_REQUEST  
        )
    
    try:
        shift = get_object_or_404(Shift, id=shift_id)
        employee = get_object_or_404(Staff, id=employee_id)
        
        # Check if the employee is assigned to the shift
        if employee not in shift.staff.all():
            return Response(
                {'error': 'Employee is not assigned to the shift'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        #Check if the shift is ongoing and return the appropriate message or check if it is completed and return the appropriate message
        if shift.status == 'completed':
            return Response(
                {'message': 'Shift is already completed'}, 
                status=status.HTTP_200_OK
            ) 
        # Validate shift can be terminated
        if shift.status != 'started':
            return Response(
                {'error': 'Shift must be ongoing to terminate'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Terminate the shift if the shift is ongoing or started
        if shift.status == 'started':
            shift.status = 'completed'
            shift.end_time = timezone.now()
            shift.save()
            return Response({
            'message': 'Shift completed successfully'}, status=status.HTTP_200_OK)
        
    except Shift.DoesNotExist:
        return Response(
            {'error': 'Shift not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    
    

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
@admin_required
def start_shift(request):
    """ Start the shift given the shift id.
    This can only be performed by users with atleast the admin role.
    The shift is retrieved using the shift id which is gotten from the request data.
    The shift status is updated to ongoing.
    """
    # Get data from request.data for PATCH/POST or request.query_params for GET
    shift_id = request.data.get('shift_id')
    
    # Validate required fields
    if not shift_id:
        return Response(
            {'error': 'shift_id is required'}, 
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        shift = get_object_or_404(Shift, id=shift_id)
        
        # Validate shift can be started
        if shift.status == 'started':
            return Response(
                {'message': 'Shift is already ongoing'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Update shift status and start time
        shift.status = 'started'
        shift.start_time = timezone.now()
        shift.save()

        return Response({
            'message': 'Shift started successfully'}, status=status.HTTP_200_OK)

    except Shift.DoesNotExist:
        return Response(
            {'error': 'Shift not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    
    
    
    
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@admin_required
def get_clients_shifts(request):
  """ Retrieve all the tasks that has been assigned to staffs.
  Given the client name or the staff name an object is created to handle the search.
  The object should contain the client details and all shifts that has been assigned in relation to them.
  """
  # retrieve the client name or the staff name from the request data
  search = request.GET.get('search')
  shift_details = []
  try:
    clients = Client.objects.filter(name__icontains=search)
    # Filter all tasks and shifts associated with the client
    # Filter task and shifts that has been assigned or ongoing
    # Append the shift details to the shift data list
    for client in clients:
      contracts = Contracts.objects.filter(client=client)
      
      for contract in contract:
        tasks = Task.objects.filter(contract=contract, status__in=['assigned', 'pending'])
        
        for task in tasks:
          shifts = Shift.objects.filter(task=task, status__in=['assigned', 'ongoing'])
          
          # If assigned and ongoing shifts are found, append the shift details to the shift data list
          # Create a base holder for the staff details
          for shift in shifts:
            shift_data = {
              'client_name': client.name,
              'shift_address': contract.address,
              'shift_postcode': contract.postcode,
              'task_id': task.task_serial,
              'start_time': task.start_time,
              'end_time': task.end_time,
              'start_date': task.start_date,
              'end_date': task.end_date,
              'shift_start_time': shift.start_time,
              'amount': task.amount,
              'status': shift.status,
              'staff': []
            }
            
            # Get all staffs assigned to a shift
            # in some case there are more that one staff assigned to a shift (task)
            # return the staff details appening it to the staff list
            # if no staff is assigned to the shift, return unassigned
            staffs = shift.staff.all()
            if staffs.exists():
              for staff in staffs:
                staff_details = {
                  'staff_name': staff.first_name + ' ' + staff.last_name,
                  'staff_email': staff.email,
                  'staff_phone': staff.phone,
                }
                shift_data['staff'].append(staff_details)
            else:
              shift_details = {
                  'staff_name': 'Unassigned',
                  'staff_email': 'N/A',
                  'staff_phone': 'N/A'
              }
              shift_data['staff'].append(staff_details)
              
              # Finally append the shift data to the shift details list
              # so every returned clients shift details is stored in the shift details list 
            shift_details.append(shift_data)
    return Response({'shift_details': shift_details}, status=status.HTTP_200_OK)
  except Exception as e:
    return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@admin_required
def approve_task(request):
    """ Method is used to approve a task selected by a staff member.
    The task and the user id is sent from the client side .
    Validate the task is yet to be assigned to a staff member before approving the task.
    """
    task_id = request.data.get('task_id')
    user_id = request.data.get('user_id')
    try:
      task = get_object_or_404(Task, id=task_id)
      staff = get_object_or_404(User, id=user_id)
      
      # Check if the task has been assigned to a staff before approving the task
      if task.status == 'assigned':
        return Response({'error': 'Task is already assigned'}, status=status.HTTP_400_BAD_REQUEST)
      
      # Create a new shift object and assign the task to the staff
      shift = Shift.objects.create(
          task=task,
          staff=staff,
          status='assigned',
          created_by=request.user
        )
      shift.save()
      task.status = 'assigned'
      task.save()
      return Response({'success': 'Task assigned to staff successfully'}, status=status.HTTP_200_OK)
    except Exception as e:
      return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
@admin_required
def update_task(request):
    """ Update the task details with the new details """
    try:
        data = request.data.get('data')
        if not data:
            return Response({'error': 'No data provided'}, status=status.HTTP_400_BAD_REQUEST)

        # Get required fields with validation
        task_id = data.get('task_id')
        if not task_id:
            return Response({'error': 'task_id is required'}, status=status.HTTP_400_BAD_REQUEST)

        # Get the task Object and validate it exists
        try:
            task = get_object_or_404(Task, id=task_id)
        except Task.DoesNotExist:
            return Response({'error': 'Task not found'}, status=status.HTTP_404_NOT_FOUND)

        # Update fields if provided
        if 'task_serial' in data:
            task.task_serial = data['task_serial']
        if 'contract_name' in data:
            task.contract.name = data['contract_name']
        if 'contract_address' in data:
            task.contract.address = data['contract_address']
        if 'contract_postcode' in data:
            task.contract.postcode = data['contract_postcode']
        if 'task_description' in data:
            task.description = data['task_description']
        if 'task_start_time' in data:
            task.start_time = data['task_start_time']
        if 'task_end_time' in data:
            task.end_time = data['task_end_time']
        if 'task_end_date' in data:
            task.end_date = data['task_end_date']
        if 'task_start_date' in data:
            task.start_date = data['task_start_date']

        # Save both task and contract
        task.contract.save()
        task.save()
        
        return Response({'message': 'Task updated successfully'}, status=status.HTTP_200_OK)
    except Exception as e:
        print(f"Error updating task: {str(e)}")  # Add logging
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        

