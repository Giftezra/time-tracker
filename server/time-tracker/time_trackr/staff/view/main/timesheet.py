from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from datetime import datetime, timedelta
from management.serializer import ShiftSerializer
from management.models import Shift
from management.view.main.decorators import staff_required



@api_view(['GET'])
@permission_classes([IsAuthenticated])
@staff_required
def get_all_completed_shifts(request):
    """ Return all user completed shifts.
    Use the filter method to filer shifts assigned to the user.
    Serialize the shifts and return many to indicate multiple shifts.
    Return the serialized data in the response.
    """
    
    try:
      shift = Shift.objects.filter(staff=request.user, status='completed')
      serializer = ShiftSerializer(shift, many=True)
      return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
      return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    