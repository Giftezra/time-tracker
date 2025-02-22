from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt

from .decorators import admin_required
from ...models import User, Task, Shift, Contracts, Client, User

from datetime import datetime, timedelta

from staff.models import Availability, Staff
from management.models import Company



""" Create a new Task and save it to the database.
Each task is created with a client, contract, task serial, description, start date, end date, start time, end time, amount, created by, and status.
  """
@api_view(['POST'])
@permission_classes([IsAuthenticated])
@admin_required
def create_task(request):
  # Validate the request data and return an error if the data is not valid 
    if not request.data:
        return Response({'error': 'Please provide the shift details'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Retrieve the company id and user id
    # Retrive the rest of the response data like description , start and end time and amount.
    # Validate that the user works for the company
    # Create a new shift object using the company and user id
    # Save the shift object
    # Return the response
    try:
      contract = get_object_or_404(Contracts, id=request.data.get('contract_id'))
    
      task = Task.objects.create(
          contract=contract,
          task_serial = request.data.get('task_serial'),
          description=request.data.get('description'),
          start_date=request.data.get('start_date'),
          start_time=request.data.get('start_time'),
          end_time=request.data.get('end_time'),
          amount=request.data.get('amount'),
          created_by=request.user,
          status = 'pending',
        )
      task.save()
      return Response({'success': 'Task created successfully'}, status=status.HTTP_201_CREATED)
    except Exception as e:
      return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@admin_required
def create_shift(request):
    """ Method is used to create a new shift and assign it to a staff member."""
    if not request.data:
        return Response({'error': 'Please provide the shift details'}, status=status.HTTP_400_BAD_REQUEST)
      
    
    try:
      # Use the id to retrieve the client, contract and staff objects
      contract = get_object_or_404(Contracts, id=request.data.get('contract_id'))
      staff = get_object_or_404(User, id=request.data.get('employee_id'))
      employee = get_object_or_404(Staff, user=staff)
      
      # Create a new task object with the client, contract and staff details
      task = Task.objects.create(
          contract=contract,
          task_serial = request.data.get('task_serial'),
          description=request.data.get('description'),
          start_date=request.data.get('start_date'),
          start_time=request.data.get('start_time'),
          end_time=request.data.get('end_time'),
          amount=request.data.get('amount'),
          created_by=request.user,
          status = 'pending',
        )
      
      # After creating the task, assign the task to the staff with the specified id.
      # The staff to be updated would only be staff member who have open availability for the next 24 hours.
      # this is to ensure the time frame for the task is covered by the staff availability.
      # 
      # Check the staff availability and ensure they are available for the task
      # If the staff is available, create a new shift object and assign the task to the staff
      shift = get_object_or_404(Shift, staff=employee, status=['pending', 'assigned'])
      old_task = shift.task
      
      # Returns a boolean value if the new task is conflicting with an existing task
      is_conflicting_task = (
        task.start_date <= old_task.start_date or
        task.end_date <= old_task.end_date or
        task.start_time <= old_task.start_time or
        task.end_time <= old_task.end_time
        )
      
      # Throw value error if the shift is conflicting with and existing task
      if is_conflicting_task:
        raise ValueError('Staff is already assigned to a task within the same time frame')
      
      # If everything is valid, create a new shift object and assign the task to the staff
      if employee:
        shift = Shift.objects.create(
            task=task,
            staff=employee,
            status='assigned',
            created_by=request.user
          )
        shift.save()
        task.status = 'assigned'
        task.save()
        
        # Update the staff availability so they become unavailable for the task duration
        availability = Availability.objects.create(
            staff=employee,
            start_date=task.start_date,
            end_date=task.end_date,
            start_time=task.start_time,
            end_time=task.end_time
          ).first()
        availability.save()
        return Response({'success': 'Task created and assigned to staff successfully'}, status=status.HTTP_201_CREATED)
      else:
        return Response({'error': 'Staff not valid'}, status=status.HTTP_400_BAD_REQUEST)
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
def get_all_unassigned_task(request):
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
    # Get all tasks associated with the contracts and that are not assigned to a staff
    tasks = Task.objects.filter(contract__client__company=company, status='pending')
    
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
    """  This method is used when a staff member sends a requset to the admins for an open shift.
    The method will expect the staff id and the task id from the request data.
    """
    if not request.data:
        return Response({'error': 'Please provide the task details'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Get the task id and the staff id from the request data
    # Retrieve both objects and ensure the staff is not assigned to any task before trying to assign them to a task or shift
    # Check the staffs availability and ensure they are available for the task and is active
    staff_id = request.data.get('staff_id')
    task_id = request.data.get('task_id')
    try:
      # Get the staff object using the staff id
      # Get the task object using the task id
      task = get_object_or_404(Task, id=task_id)
      staff = get_object_or_404(Staff, id=staff_id)

      # Get the staff availability and ensure they are available for the task
      available = Availability.objects.filter(staff=staff, start_date__lte=task.start_date, end_date__gte=task.end_date, start_time__lte=task.start_time, end_time__gte=task.end_time)
      
      # If a staff is not available for the task, return an error to the client
      if not available:
        return Response({'error': 'Staff is not available for the task'}, status=status.HTTP_400_BAD_REQUEST)
      
      # Ensure the task is not already assigned to a staff before assigning the task to the staff
      if task.status == 'assigned':
        return Response({'error': 'Task is already assigned'}, status=status.HTTP_400_BAD_REQUEST)
      
      # After confirming availabilty and that the task is not assigned, assign the task to the staff
      shift = Shift.objects.create(
          task=task,
          staff=staff,
          status='pending',
          created_by=request.user
        )
      if shift:
        task.status = 'assigned'
        shift.save()
        task.save()
        
        # Update this part of the code to send an email to the staff with the task details
      else:
        return Response({'error': 'Could not assign task to staff'}, status=status.HTTP_400_BAD_REQUEST)
      return Response({'success': 'Task assigned to staff successfully'}, status=status.HTTP_200_OK)
    except Exception as e:
      return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
      
      

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
                    'client_name': shift.task.contract.client.name,
                    'employee_id': employee.id,
                    'employee_name': employee.user.get_full_name(),
                    'start_time': shift.start_time,
                })

        return Response({'active_shifts': shift_data}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)





@api_view(['POST'])
@permission_classes([IsAuthenticated])
@admin_required
def terminate_shift(request):
    """ Terminate the shift given the shift id.
    This can only be performed by users with atleast the admin role.
    The shift is retrieved using the shift id which is gotten from the request data.
    The shift status is updated to completed.
    """
    shift_id = request.data.get('shift_id')
    try:
      shift = get_object_or_404(Shift, id=shift_id)
      task = shift.task # Get the task object to update the status
      shift.status = 'completed'
      shift.end_time = datetime.now()
      task.status = 'completed'
      shift.save()
      return Response({'success': 'Shift completed successfully'}, status=status.HTTP_200_OK)
    except Exception as e:
      return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    
    
    
    
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
@admin_required
def start_shift(request):
    """ Start the shift given the shift id.
    This can only be performed by users with atleast the admin role.
    The shift is retrieved using the shift id which is gotten from the request data.
    The shift status is updated to ongoing.
    """
    shift_id = request.data.get('shift_id')
    try:
      shift = get_object_or_404(Shift, id=shift_id)
      shift.status = 'ongoing'
      shift.start_time = datetime.now()
      shift.save()
      return Response({'success': 'Shift started successfully'}, status=status.HTTP_200_OK)
    except Exception as e:
      return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    
    
    
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@admin_required
def get_clients_shifts(request):
  """ Retrieve all the tasks that has been assigned to staffs.
  Given the client name or the staff name an object is created to handle the search.
  The object should contain the client details and all shifts that has been assigned in relation to them.
  """
  # retrieve the client name or the staff name from the request data
  search = request.data.get('search')
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
