from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from datetime import datetime, timedelta, timezone
from django.shortcuts import get_object_or_404
from management.models import Shift, Task, TaskComment
from management.helpers import get_coordinates_from_address
from staff.models import Staff
from management.view.main.decorators import staff_required
from django_ratelimit.decorators import ratelimit
from django.core.cache import cache
from django.conf import settings
from management.helpers import get_cache_key
     



@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
@staff_required
@ratelimit(key='user', rate='5/h', method=['PATCH'], block=True)
def start_shift(request):
    """Method is used to trigger the shift start.
    Gets the shift id from the request data and validates:
    1. The shift exists
    2. The shift is assigned to the user
    3. The shift is not already started
    4. The shift's scheduled start time is within an acceptable window
    """
    shift_id = request.data.get('shift_id')
    try:
        shift = get_object_or_404(Shift, id=shift_id)
        
        # Check if shift is assigned and not already started
        if shift.status != 'assigned':
            return Response(
                {'error': 'Shift must be assigned before it can be started'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Convert shift start time to datetime with date
        shift_start = datetime.combine(
            shift.task.start_date,
            shift.task.start_time
        ).replamce(tzinfo=timezone.utc)
        
        # Get current time in UTC
        current_time = datetime.now(timezone.utc)
        time_diff = current_time - shift_start
        if time_diff < timedelta(minutes=-15) or time_diff > timedelta(minutes=60):
            return Response(
                {'error': 'Shift can only be started within 15 minutes before or 1 hour after scheduled start time. You have to contact your manager if you need to start the shift earlier.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Update shift status and start time
        shift.status = 'started'
        shift.start_time = current_time
        shift.save()

        return Response({
            'message': 'Shift started successfully',
            'shift': {
                'id': shift.id,
                'status': shift.status,
                'start_time': shift.start_time
            }
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
@staff_required
@ratelimit(key='user', rate='20/h', method=['PATCH'], block=True)
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
            shift.status = 'completed'
            shift.end_time = datetime.now(timezone.utc)
            shift.save()
            return Response({'message': 'Shift ended successfully'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'You can only end a shift that has been started'}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@staff_required
@ratelimit(key='user', rate='50/h', method=['GET'], block=True)
def get_task_details(request):
  """ This method is used to get the details of the task with the provided task id. """
  task_id = request.GET.get('task_id')
  try:
    # Get the task object and return specific fields into an array which will be returned to the client.
    tasks = get_object_or_404(Task, id=task_id)
    cache_key = get_cache_key('task_details', task_id) # Create a cache key for the task details
    cached_data = cache.get(cache_key) # Get the task details from the cache
    if cached_data:
      return Response({'task_details': cached_data}, status=status.HTTP_200_OK)
    else:
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
      cache.set(cache_key, task_details, timeout=settings.CACHE_TIMEOUT) # Cache the task details
    return Response({'task_details': task_details}, status=status.HTTP_200_OK)
  except Task.DoesNotExist:
    return Response({'error': 'Task does not exist'}, status=status.HTTP_400_BAD_REQUEST)
  except Exception as e:
    return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
  

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@staff_required
@ratelimit(key='user', rate='100/h', method=['GET'], block=True)
def get_day_task(request):
  """ This method is used to get the tasks available in the users company.
   Given the day in the params, the method will return an array list of 
    all tasks that are not assigned yet (can be either pending or selected).
    """
  try:
    day = request.GET.get('day') # Get the day from the request to display the tasks for that day
    day = int(day)
  except ValueError:
    return Response({'error': 'Please provide a valid day'}, status=status.HTTP_400_BAD_REQUEST)
  try:
    if request.user.is_employee:
      employee = get_object_or_404(Staff, user=request.user)
      company = employee.company
    else:
      return Response({'error': 'USER IS NOT ASSOCIATED WITH A COMPANY'}, status=status.HTTP_403_FORBIDDEN)
  except Staff.DoesNotExist:  # If the user is not a staff member
      return Response({'error': 'USER IS NOT A STAFF MEMBER'}, status=status.HTTP_403_FORBIDDEN)
  
  try:
     # Get all tasks that are not assigned yet (pending or selected) that are associated with the users company
    tasks = Task.objects.filter(
      contract__client__company=company,
      is_completed=False,
      start_date__day=day
      )
    # Return a message if there are no tasks available for the day
    if not tasks.exists():
      return Response({'error': 'There is no task for today...Please check back later.'}, status=status.HTTP_400_BAD_REQUEST)
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
      
    return Response({'tasks': task_list, 'message': 'Congratulations! There are tasks available for the selected day.'}, status=status.HTTP_200_OK)
  except Exception as e:
    return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    
@api_view(['PATCH']) 
@permission_classes([IsAuthenticated])   
@staff_required
@ratelimit(key='user', rate='20/h', method=['PATCH'], block=True)
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
@ratelimit(key='user', rate='50/h', method=['GET'], block=True)
def get_monthly_task(request):
    """Get the dates of all unassigned tasks that are available in the request users company."""
    month = request.GET.get('month')
    year = request.GET.get('year')
    
    if not month or not year:
        return Response({'error': 'Please provide a month and year'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        month = int(month)
        year = int(year)
    except ValueError:
        return Response({'error': 'Please provide a valid month and year'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        if request.user.is_employee:
            employee = get_object_or_404(Staff, user=request.user)
            company = employee.company
        else:
            return Response({'error': 'USER IS NOT ASSOCIATED WITH A COMPANY'}, status=status.HTTP_403_FORBIDDEN)
    except Staff.DoesNotExist:
        return Response({'error': 'USER IS NOT A STAFF MEMBER'}, status=status.HTTP_403_FORBIDDEN)
    
    try:
        tasks = Task.objects.filter(
            contract__client__company=company,
            is_completed=False,
            start_date__month=month,
            start_date__year=year
        )
        
        if not tasks.exists():
            return Response({'error': 'Sorry, there are no tasks available for the selected month.'},status=status.HTTP_400_BAD_REQUEST)
        
        # Create marked dates object similar to availability calendar
        marked_dates = {}
        for task in tasks:
            date_str = task.start_date.strftime('%Y-%m-%d')
            if date_str not in marked_dates:
                marked_dates[date_str] = {
                    'startingDay': True,
                    'endingDay': True,
                    'color': 'blue',  # Different color for tasks
                    'textColor': 'white'
                }
        
        return Response({
            'marked_dates': marked_dates,
            'message': 'Congratulations! There are tasks available for the selected month.'
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@staff_required
@ratelimit(key='user', rate='100/h', method=['GET'], block=True)
def get_current_day_shifts(request):
    """Get all shifts for a given day, ordered by start time.
    Returns additional metadata about shift status and eligibility to start."""
    try:
        day = request.GET.get('day')
        staff = get_object_or_404(Staff, user=request.user)
        try:
           company = staff.company
        except Staff.DoesNotExist:
           return Response({'error': 'Staff not associated with company'}, status=status.HTTP_403_FORBIDDEN)
        
        cache_key = get_cache_key('current_day_shifts', staff.id) # Create a cache key for the current day shifts
        cached_data = cache.get(cache_key) # Get the current day shifts from the cache
        if cached_data :
          return Response({'shifts': cached_data}, status=status.HTTP_200_OK)
        
        # Filter shifts and order by start time
        shifts = Shift.objects.filter(
            staff=staff,
            start_date__day=day,
            status__in=['assigned', 'started'],
            task__contract__client__company=company
        ).order_by('task__start_time')

        shift_data = [] # Create a list to hold the shift data
        for shift in shifts:
          colleagues = shift.staff.all() # Exclude the request user from the list of colleagues
          colleagues_data = [] # Create a list to hold the colleagues data
          for colleague in colleagues: # Loop through the colleagues to get individual details
            colleagues_data.append({
              'staff_id': colleague.id,
              'name': colleague.user.get_full_name(),
              })
            latitude, longitude = get_coordinates_from_address(shift.task.contract.address, shift.task.contract.postcode)

          shift_data.append({
            'shift_id':shift.id,
            'task_serial':shift.task.task_serial,
            'start_time':shift.task.start_time,
            'end_time':shift.task.end_time,
            'contract_name':shift.task.contract.name,
            'team_member':colleagues_data,
            'status':shift.status,
            'latitude':latitude,
            'longitude':longitude
          })
        return Response({'shifts': shift_data}, status=status.HTTP_200_OK)
    except Staff.DoesNotExist:
        return Response({'error': 'Staff record not found'}, 
                      status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': 'Server error'}, 
                      status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@staff_required
@ratelimit(key='user', rate='20/h', method=['POST'], block=True)
def create_task_comment(request):
    """Create a comment for a task."""
    try:
        # Retrieve the shift id from the request data and the comment from the request data
        # Create a staff object for the request user and get the task comment model
        shift_id = request.data.get('shift_id')
        comment = request.data.get('comment')
        shift = get_object_or_404(Shift, id=shift_id)
        staff = get_object_or_404(Staff, user=request.user)

        task_comment = TaskComment.objects.create(
            shift=shift,
            comment=comment,
            created_by=staff
        )
        task_comment.save()
        return Response({'message': 'Comment created successfully'}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
