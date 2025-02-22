from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from datetime import datetime, timedelta

from django.shortcuts import get_object_or_404

from management.models import Shift
from management.serializer import ShiftSerializer

from staff.models import Staff
from management.view.main.decorators import staff_required

from staff.tasks import send_shift_cancellation_email





""" Method retrieves shifts assigned to a user that would start in the next 24 hours."""
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_shift_in_12(request):
    now = datetime.now()
    later = now + timedelta(hours=12)
    try:
        # Get the user's shifts that start in the next 24 hours
        shifts = Shift.objects.filter(staff=request.user, status='assigned', start__gte=now, start__lte=later)
        
        # Serialize the shifts and return the response
        serializer = ShiftSerializer(shifts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@staff_required
def just_get(request):
    return Response({'message': 'Hello World'}, status=status.HTTP_200_OK)
    
    
    

@staff_required
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_assigned_shifts(request):
    print(request.user)
    """ Return all user assigned shifts.
    Use the filter method to filer shifts assigned to the user.
    Serialize the shifts and return many to indicate multiple shifts.
    Return the serialized data in the response.
  """
    try:
      shift_data = [] # Create an empty array to store the shift data
      staff = get_object_or_404(Staff, user=request.user)
      # Get the shifts assigned to the user
      try:
          shifts = Shift.objects.filter(staff=staff, status='assigned')
      except Shift.DoesNotExist:
          return Response({'error': 'No assigned shifts'}, status=status.HTTP_400_BAD_REQUEST)
      # Pass the shift object into an array for the client
      for shift in shifts:
          shift_data.append ({
              'id': shift.id,
              'site_address':shift.task.contract.address,
              'site_postcode': shift.task.contract.postcode,
              'site_name': shift.task.contract.name,
              'start_date': shift.task.start_date,
              'start_time': shift.task.start_time,
              'end_time': shift.task.end_time,
              'description': shift.task.description,
          })
          print(shift_data)
          # Return the shift data to the client
          return Response({'shift_data' : shift_data}, status=status.HTTP_200_OK)
    except Exception as e:
      return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@staff_required
def get_shift_details(request):
    """ Method is used by the staff to get the details of a shift.
      The shift id is used to get the shift details.
    """
    # Retrieve the shift id from the request data
    shift_id = request.query_params.get('shift_id')
    # Use the id to get the details of the particular shift.
    # The details includes the details of their colleagues, the shift details and the amount to be paid.
    try:
        shift = Shift.objects.get(id=shift_id)
        # Get the colleagues associated with the shift
        colleagues = shift.staff.all()
        for colleague in colleagues:
            colleague_data = {
                'id': colleague.id,
                'name': colleague.user.get_full_name(),
            }
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
        }
        # Return the shift details to the client
        return Response({'shift_details': shift_details}, status=status.HTTP_200_OK)
    except Shift.DoesNotExist:
        return Response({'error': 'No shift found'}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
@staff_required
def cancel_shift(request):
    """ Method is used by the staff to cancel or reject a shift.
      The shift id is used to get the shift details.
    """
    # Get the shift id from the request data
    shift_id = request.query_params.get('shift_id')
    # Use the id to get the shift details
    try:
        shift = Shift.objects.get(id=shift_id)
        # Check if the shift is assigned to the user
        if shift.staff == request.user:
            # Update the shift status to cancelled
            shift.status = 'cancelled'
            shift.save()
            # Send an email to the staff member who created the shift and provide all neccessary details
            # 1. Staff name
            # 2. Client name
            # 3. Shift date
            # 4. Shift time
            # 5. Email of the staff member who created the shift
            send_shift_cancellation_email.delay(shift.created_by.email, request.user.name, shift.task.contract.client.name, shift.task.start_time, shift.task.end_time)
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
        shift_id = request.query_params.get('shift_id')
        shift = Shift.objects.get(id=shift_id)
        # Check if the shift is assigned to the user
        # Update the shift status and the task status to assigned
        if shift.staff == request.user:
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
      
 