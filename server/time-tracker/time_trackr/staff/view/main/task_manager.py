from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from datetime import datetime, timedelta, timezone

from django.shortcuts import get_object_or_404

from management.models import Shift, Task
from staff.models import Staff
from staff.tasks import send_shift_cancellation_email, send_shift_application_email

from management.view.main.decorators import staff_required
    
     



@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
@staff_required
def start_shift(request):
    """ Method is used to trigger the shift start.
    Gets the shift id from the request data.
    and retrieves the shift object using the shift id.
    """
    # Get the shift id from the request data
    shift_id = request.data.get('shift_id')
    try:
        shift = get_object_or_404(Shift, id=shift_id)
        # Check if the shift is assigned to the user
        # Check if the shift is assigned
        if shift.status == 'assigned':
            # Update the shift status to started
            shift.status = 'started'
            shift.start_time = datetime.now()
            # Save the shift
            shift.save()
            # Return a response to the client
            return Response({'message': 'Shift started successfully'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Shift is not assigned'}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
@staff_required
def end_shift(request):
    """ Method is used to trigger the shift end algorithm given the shift id.
    The shift id is retrieved from the request data.
    The shift object is retrieved using the shift id.
    The shift status is updated to completed.
    The shift end time is updated to the current time.
    The shift object is saved.
    The response is returned.
    """
    shift_id = request.data.get('shift_id')
    try:
        shift = get_object_or_404(Shift, id=shift_id)
        # Check if the shift is assigned to the user
        if shift.status == 'started':
            # Update the shift status to completed
            shift.status = 'completed'
            # Update the shift end time to the current time
            shift.end_time = datetime.now()
            # Update the task status to completed
            shift.task.status = 'completed'
            # Save the shift
            shift.save()
            shift.task.save()
            # Return a response to the client
            return Response({'message': 'Shift ended successfully'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'You can only end a shift that has been started'}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@staff_required
def get_task_details(request):
  """ This method is used to get the details of the task with the provided task id. """
  task_id = request.GET.get('task_id')
  try:
    # Get the task object and return specific fields into an array which will be returned to the client.
    tasks = get_object_or_404(Task, id=task_id)
    # Create a dictionary to hold the task details
    task_details = {
      'id': tasks.id,
      'task_serial':tasks.task_serial,
      'site_name':tasks.contract.name,
      'site_address':tasks.contract.address,
      'site_postcode':tasks.contract.postcode,
      'site_city':tasks.contract.city,
      'start_time':tasks.start_time,
      'end_time':tasks.end_time,
      'start_date':tasks.start_date,
      'description':tasks.description,
      'pay':tasks.amount
      }
    return Response({'task_details': task_details}, status=status.HTTP_200_OK)
  except Task.DoesNotExist:
    return Response({'error': 'Task does not exist'}, status=status.HTTP_400_BAD_REQUEST)
  except Exception as e:
    return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
  

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@staff_required
def get_available_tasks(request):
  """ This method is used to get the tasks available in the users company.
   Given the day in the params, the method will return an array list of 
    all tasks that are not assigned yet (can be either pending or selected).
    """
  day = request.GET.get('day')

  # Ensure the day is provided
  if not day:
    return Response({'error': 'Please provide a day'}, status=status.HTTP_400_BAD_REQUEST)
  
  try:
    day = int(day)
  except ValueError:
    return Response({'error': 'Please provide a valid day'}, status=status.HTTP_400_BAD_REQUEST)
  
  # Get the company of the user
  try:
    if request.user.is_employee:
      employee = get_object_or_404(Staff, user=request.user)
      company = employee.company
    else:
      return Response({'error': 'USER IS NOT ASSOCIATED WITH A COMPANY'}, status=status.HTTP_400_BAD_REQUEST)
  except Staff.DoesNotExist:  # If the user is not a staff member
      return Response({'error': 'USER IS NOT A STAFF MEMBER'}, status=status.HTTP_400_BAD_REQUEST)
  
  try:
     # Get all tasks that are not assigned yet (pending or selected) that are associated with the users company
    tasks = Task.objects.filter(
      contract__client__company=company,
      status__in=['pending', 'selected'],  # Allow both pending and selected tasks
      start_date__day=day
      )
    # Return a message if there are no tasks available for the day
    if not tasks.exists():
      return Response({'message': 'NO TASKS AVAILABLE FOR THE SELECTED DAY'}, status=status.HTTP_200_OK)
    # Create a list to hold the task details
    task_list = []
    for task in tasks:
      task_list.append({
        'id': task.id,
        'site_name': task.contract.name,
        'site_address': task.contract.address,
        'site_postcode': task.contract.postcode,
        'start_time': task.start_time,
        'end_time': task.end_time,
        'start_date': task.start_date,})
    return Response({'tasks': task_list}, status=status.HTTP_200_OK)
  except Exception as e:
    return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    
@api_view(['PATCH']) 
@permission_classes([IsAuthenticated])   
@staff_required
def apply_task(request):
    """
    Allow staff to apply for tasks that are either pending or selected,
    but not assigned. Multiple staff can apply for the same task.
    """
    task_id = request.GET.get('task_id')
    try:
        task = get_object_or_404(Task, id=task_id)
        if task.status in ['pending', 'selected']:  # Allow applying if task is pending or selected
            if task.status == 'pending':
                task.status = 'selected'
                task.save()
            
            # Send an email to the admin member who created the task
            send_shift_application_email.delay(
                task.contract.name, 
                request.user.first_name, 
                task.start_date, 
                task.start_time, 
                task.created_by.email
            )
            return Response({'message': 'Successfully applied for the task'}, status=status.HTTP_200_OK)
        elif task.status == 'assigned':
            return Response({'error': 'Task has already been assigned'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'error': 'Task is not available for application'}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
  


@api_view(['GET'])
@permission_classes([IsAuthenticated])
@staff_required
def get_all_task_dates(request):
  """ This method is used to get the dates of all unassigned tasks that are available in the request users company. """

  month = request.GET.get('month')
  year = request.GET.get('year')
  # Ensure the year and month is provided
  if not month or not year:
    return Response({'error': 'Please provide a month and year'}, status=status.HTTP_400_BAD_REQUEST)
  
  try:
    month = int(month)
    year = int(year)
  except ValueError:
    return Response({'error': 'Please provide a valid month and year'}, status=status.HTTP_400_BAD_REQUEST)
  
  # Get the users company
  try:
    if request.user.is_employee:
      employee = get_object_or_404(Staff, user=request.user)
      company = employee.company
    else:
      return Response({'error': 'USER IS NOT ASSOCIATED WITH A COMPANY'}, status=status.HTTP_400_BAD_REQUEST)
  except Staff.DoesNotExist:
      return Response({'error': 'USER IS NOT A STAFF MEMBER'}, status=status.HTTP_400_BAD_REQUEST)
  
  try:
    # Get the tasks that are unassigned and in the users company using a reverse lookup
    # Get the data given the month sent in the request data
    tasks = Task.objects.filter(
      contract__client__company=company,
      status='pending',
      start_date__month=month,
      start_date__year=year
      )
    # Check if there are any tasks
    if not tasks.exists():
      return Response({'message': 'No tasks available'}, status=status.HTTP_200_OK)
    
    # Get the dates of the tasks
    task_dates = sorted(set(task.start_date.strftime('%Y-%m-%d') for task in tasks))
    return Response({'task_dates': task_dates}, status=status.HTTP_200_OK)
  except Exception as e:
    return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
  

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@staff_required
def get_current_day_shifts(request):
    """ This method is used to get an array of the users assigned shift given the 
     current day which is sent from the client.
      The method uses the current day to filter the shifts and return the shifts based on the task start time, task end time, contract name and the colleagues associated with the shift."""
    try:
        # Get timezone-aware current date
        day = request.GET.get('day')
        print('today', day)
        staff = get_object_or_404(Staff, user=request.user)
        # Check the user company 
        if not staff.company:
            return Response({'error': 'Staff not associated with company'},status=status.HTTP_403_FORBIDDEN)
        # Filter the shifts by the staff, today's date, assigned status and the company
        # Prefetch the staff and task objects and order by the task start time
        shifts = Shift.objects.filter(
            staff=staff,
            task__start_date__day=day,
            status__in=['assigned', 'started'],
            task__contract__client__company=staff.company
        ).order_by('task__start_time')
        # Get shift data and return it in a list
        # Also get the colleague's associated with the shift
        shift_data = []
        for shift in shifts:
          colleagues = shift.staff.exclude(id=staff.id)
          # Loop the colleagues to get individual details
          colleagues_data = []
          for colleague in colleagues:
            colleagues_data.append({
              'staff_id': colleague.id,
              'name': colleague.user.get_full_name(),
              })
            print('colleagues_data', colleagues_data)
          shift_data.append({
            'shift_id':shift.id,
            'task_serial':shift.task.task_serial,
            'start_time':shift.task.start_time,
            'end_time':shift.task.end_time,
            'contract_name':shift.task.contract.name,
            'team_member':colleagues_data,
            'status':shift.status
          })
        return Response({'shifts': shift_data}, status=status.HTTP_200_OK)
    except Staff.DoesNotExist:
        return Response({'error': 'Staff record not found'}, 
                      status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': 'Server error'}, 
                      status=status.HTTP_500_INTERNAL_SERVER_ERROR)