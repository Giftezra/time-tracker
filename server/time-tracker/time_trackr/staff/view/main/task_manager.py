from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from datetime import datetime, timedelta

from django.shortcuts import get_object_or_404

from management.models import Shift, Task

from management.view.main.validation import staff_required
    
     
@api_view(['POST'])
@permission_classes([IsAuthenticated])
@staff_required
def accept_shift(request):
    shift_id = request.data.get('shift_id')
    try:
      # Get the shift id from the request data
      # Retrieve the shift and the associated task setting the status to assigned.
      # Save the shift and return the response.
      shift = get_object_or_404(Shift, id=shift_id)
      task = shift.task
      if shift.status == 'pending':
        shift.status = 'assigned'
        task.status = 'assigned'
        shift.save()
        return Response({'message': 'Shift accepted successfully'}, status=status.HTTP_200_OK)
      else:
        return Response({'error': 'Shift is not pending'}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
      return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@staff_required
def cancel_shift(request):
    shift_id = request.data.get('shift_id')
    try:
      # Get the shift id from the request data
      # Retrieve the shift and the associated task setting the status to cancelled.
      # Save the shift and return the response.
      shift = get_object_or_404(Shift, id=shift_id)
      task = shift.task
      if shift.status == 'pending':
        shift.status = 'cancelled'
        task.status = 'pending'
        shift.save()
        return Response({'message': 'Shift cancelled successfully'}, status=status.HTTP_200_OK)
      else:
        return Response({'error': 'Shift is not pending'}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
      return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    


@api_view(['POST'])
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
      shift = get_object_or_404(Shift, pk=shift_id)
      if shift.status == 'assigned':
        shift.status = 'started'
        shift.start_time = datetime.now()
        shift.save()
        return Response({'message': 'Shift started successfully'}, status=status.HTTP_200_OK)
      else:
        return Response({'error': 'Shift is not assigned'}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
      return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    


@api_view(['POST'])
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
      task = shift.task # Get the task object and set the status too
      if shift.status == 'started':
        shift.status = 'completed'
        shift.end_time = datetime.now()
        task.status = 'completed'
        shift.save()
      else:
        return Response({'error': 'Shift is not started'}, status=status.HTTP_400_BAD_REQUEST)
      return Response({'message': 'Shift ended successfully'}, status=status.HTTP_200_OK)
    except Exception as e:
      return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    
    
@api_view(['POST']) 
@permission_classes([IsAuthenticated])   
@staff_required
def select_task(request):
  # Use the id in the request body to get the task id
  # retrieve the task and set the status to selected.
  # This is designed to send a flag to the admins that the task has been selected.
  # so they could assign the task to the user
  task_id = request.data.get('task_id')
  try:
    task = get_object_or_404(Task, id=task_id)
    task.status = 'selected'
    task.save()
    return Response({'message': 'Task selected successfully'}, status=status.HTTP_200_OK)
  except Exception as e:
    return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)