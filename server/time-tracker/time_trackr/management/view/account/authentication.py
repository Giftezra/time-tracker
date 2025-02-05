from datetime import datetime
from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import get_object_or_404
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from ...serializer import UserSerializer

from ..main.decorators import admin_required, owner_required

from ...models import User, Identity
from management.models import Company
from staff.models import Staff
from ...tasks import send_staff_onboard_email, send_owner_onboarding_email


""" Register the owner of the company which will be the first user of the company
Post request to the endpoint /api/v1/register/owner
permissions: AllowAny
"""
@api_view(['POST'])
@permission_classes([AllowAny])
def register_owner(request):
  # Check if the request data is empty
  if not request.data:
    return Response({'error': 'Please provide the user details'}, status=status.HTTP_400_BAD_REQUEST)
  
  # Create a new user with the request data
  # Return a success message if the user is created successfully
  try:
    required_fields = ['first_name', 'last_name', 'email', 'phone', 'password', 'dob', 'address', 'city', 'postcode']
    for field in required_fields:
      if not request.data.get(field):
        return Response({'error': f'{field} is required'}, status=status.HTTP_400_BAD_REQUEST)
      
    validated_data = {
      'first_name': request.data.get('first_name'),
      'last_name': request.data.get('last_name'),
      'email': request.data.get('email'),
      'phone': request.data.get('phone'),
      'password': request.data.get('password'),
      'dob': request.data.get('dob'),
      'address': request.data.get('address'),
      'city': request.data.get('city'),
      'postcode': request.data.get('postcode')
    }
    
    # Create the user
    user = User.objects.create_owner(**validated_data)
    user.save()
    
    # Send a welcome email to the owner after user is created
    send_owner_onboarding_email.delay(validated_data['email'])

    return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)
  except Exception as e:
    print(f"Error: {e}")
    return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
  
  
  
@api_view(['POST'])
@permission_classes([IsAuthenticated])
@admin_required
def onboard_employee(request):

  if not request.data:
    return Response({'error': 'Please provide the user details'}, status=status.HTTP_400_BAD_REQUEST)

  # Get company based on user role
  if request.user.is_owner:
    company = get_object_or_404(Company, owner=request.user)
  else:
    # If the request user is not an owner, get the company through the staff relationship
    staff = get_object_or_404(Staff, user=request.user)
    company = staff.company
    
  # Check the role
  # Use the role to direct the object creation
  # Create admin if role is admin and staff if role is staff
  # Return the valid responses
  try:
    required_fields = ['first_name', 'last_name', 'email', 'phone', 'password', 'dob', 'address', 'city', 'postcode', 'country', 'role', 'id_type', 'id_front', 'id_back']
    for field in required_fields:
      if not request.data.get(field):
        return Response({'error': f'{field} is required'}, status=status.HTTP_400_BAD_REQUEST)
    
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
    # Get the user role
    role = request.data.get('role')

    if role == 'admin':
      user = User.objects.create_admin(**validated_data)
      user.save()

      # Create the staff object and associate it with the admin
      admin = Staff.objects.create(
        user=user,
        company=company,
        date_hired=datetime.now()
      )
      admin.save()

      # Create the identity object and associate it with the admin
      identity = Identity.objects.create(
        user=user,
        id_type=request.data.get('id_type'),
        id_front=request.data.get('id_front'),
        id_back=request.data.get('id_back')
      )
      identity.save()
      
      return Response({'message': 'Admin created successfully'}, status=status.HTTP_201_CREATED)
      
    elif role == 'staff':
      user = User.objects.create_staff(**validated_data)
      user.save()
      # Create the staff object and associate it with the staff
      employee = Staff.objects.create(
        user=user,
        company=company,
        date_hired=datetime.now()
      )
      employee.save()
      
      # Create the identity object and associate it with the staff
      identity = Identity.objects.create(
        user=user,
        id_type=request.data.get('id_type'),
        id_front=request.data.get('id_front'),
        id_back=request.data.get('id_back')
      )
      identity.save()
      """ After successful user creation, send an email to the user using celery to send the email in the background """
      send_staff_onboard_email.delay(company.name, validated_data['first_name'], validated_data['email'], validated_data['password'], role)
      return Response({'message': 'Staff created successfully'}, status=status.HTTP_201_CREATED)
  except Exception as e:
    return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
  
  