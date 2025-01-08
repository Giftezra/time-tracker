from django.forms import ValidationError
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from django.shortcuts import get_object_or_404

from ...models import Company

from .validation import owner_required


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@owner_required
def create_company(request):
  pass