from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from datetime import datetime, timedelta
from django.shortcuts import get_object_or_404
from collections import defaultdict
from django.db.models import Q
from management.models import Shift
from management.serializer import ShiftSerializer
from staff.models import Staff
from management.view.main.decorators import staff_required
from django_ratelimit.decorators import ratelimit
from django.core.cache import cache
from django.conf import settings
from management.helpers import get_cache_key


        

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@staff_required
@ratelimit(key='user', rate='100/h', block=True)
def get_shift_details(request):
    """ Method is used by the staff to get the details of a shift.
      The shift id is used to get the shift details.
    """
    # Retrieve the shift id from the request data
    shift_id = request.GET.get('shift_id')
    # Use the id to get the details of the particular shift.
    # The details includes the details of their colleagues, the shift details and the amount to be paid.
    try:
        shift = Shift.objects.get(id=shift_id)
        cache_key = get_cache_key('shift_details', shift_id)
        cache_data = cache.get(cache_key)
        if cache_data:
            return Response({'shift_details': cache_data}, status=status.HTTP_200_OK)
        
        else:
            colleague_data = []
            colleagues = shift.staff.exclude(user=request.user)
            for colleague in colleagues:
                colleague_data.append({
                'id': colleague.id,
                'name': colleague.user.get_full_name(),
            })
        # Get the shift details and append the colleague data to the shift data
        shift_details = {
            'id':shift.id,
            'client': shift.task.contract.client.name,
            'site_name': shift.task.contract.name,
            'site_address': shift.task.contract.address,
            'site_postcode': shift.task.contract.postcode,
            'start_time': shift.task.start_time,
            'end_time': shift.task.end_time,
            'information': shift.task.description,
            'pay': shift.task.amount,
            'colleagues': colleague_data,
            'status': shift.status
        }
        cache.set(cache_key, shift_details, timeout=settings.CACHE_TIMEOUT)
        return Response({'shift_details': shift_details}, status=status.HTTP_200_OK)
    except Shift.DoesNotExist:
        return Response({'error': 'No shift found'}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
@staff_required
def decline_shift(request):
    """ Method is used by the staff to cancel or reject a shift.
      The shift id is used to get the shift details.
    """
    # Get the shift id from the request data
    shift_id = request.data.get('shift_id')
    # Use the id to get the shift details
    try:
        # Create the staff object using the request user
        staff = Staff.objects.get(user=request.user)
        # Get the shift using the shift id
        shift = Shift.objects.get(id=shift_id)
        # Check if the shift is assigned to the user
        if shift.staff.filter(id=staff.id).exists():
            # Check the shift status
            if shift.status in ['pending', 'assigned']:
                # Update the shift status to cancelled
                shift.status = 'cancelled'
                shift.task.status = 'pending' # Set the task status to pending
                shift.save()
                shift.task.save()
                # Send an email to the staff member who created the shift and provide all neccessary details
                # 1. Staff name
                # 2. Client name
                # 3. Shift date
                # 4. Shift time
                # 5. Email of the staff member who created the shift
            # send_shift_cancellation_email.delay(shift.created_by.email, request.user.name, shift.task.contract.client.name, shift.task.start_time, shift.task.end_time)
            # Return a response to the client
            return Response({'message': 'Shift cancelled successfully'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Shift not assigned to you'}, status=status.HTTP_400_BAD_REQUEST)
    except Shift.DoesNotExist:
        return Response({'error': 'No shift found'}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
@staff_required
def accept_shift(request):
    """ This method is used to update the database when the shift has been accepted by the staff.
      The shift id is used to get the shift details.
    """
    try:
        shift_id = request.data.get('shift_id')
        shift = Shift.objects.get(id=shift_id)
        # Create the staff object using the request user
        staff = Staff.objects.get(user=request.user)
        # Check if the shift is assigned to the user
        # Update the shift status and the task status to assigned
        if shift.staff.filter(id=staff.id).exists():
            # Check the shift status
            if shift.status == 'pending':
                # Update the shift status and the task status to assigned
                shift.status = 'assigned'
                shift.task.status = 'assigned'
                shift.save()
                shift.task.save()
                return Response({'message': 'Shift accepted successfully'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Shift not assigned to you'}, status=status.HTTP_400_BAD_REQUEST)  
    except Shift.DoesNotExist:
        return Response({'error': 'No shift found'}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)  

    
    
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
@staff_required
def get_shift_by_date(request):
    """ Method is used by the staff to get the shifts data given a date.
      The date is used to filter the shifts assigned to the user. 
    """
    if not request.data:
        return Response({'error': 'Please provide a date'}, status=status.HTTP_400_BAD_REQUEST)
      
      # Get the date from the request data
      # retrive the shift using the data and get the associated task
      # check if the task start time is equal to the date
      # serialize the shifts and return the response data to the client
    date = request.data.get('date')
    shift = Shift.objects.filter(staff=request.user, status__in=['assigned', 'pending'])
    task = shift.task
    if task.start_time == date:
        serializer = ShiftSerializer(shift, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'No shift for the date'}, status=status.HTTP_400_BAD_REQUEST)
      

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@staff_required
def get_calendar_shifts(request):
    """Method returns all assigned shifts grouped by date for the calendar agenda view.
    Uses the shift's start date as the key.
    """
    try:
        # Get the staff object using the request user
        staff = Staff.objects.get(user=request.user.id)
        # Get all assigned and pending shifts for the user
        shifts = Shift.objects.filter(
            staff=staff,
            status__in=['assigned', 'pending']
        )
        # Create a list to store all shift data
        calendar_data = []
        for shift in shifts:
            calendar_data.append({
                'id': shift.id,
                'site_name': shift.task.contract.name,
                'site_address': shift.task.contract.address,
                'site_postcode': shift.task.contract.postcode,
                'start_time': shift.task.start_time,
                'end_time': shift.task.end_time,
                'information': shift.task.description,
                'start_date': shift.task.start_date
            })
        return Response({'calendar_data': calendar_data}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response(
            {'error': f'Failed to fetch calendar data: {str(e)}'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
 