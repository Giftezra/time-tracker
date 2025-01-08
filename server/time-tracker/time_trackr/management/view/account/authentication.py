import datetime
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from ...serializer import UserSerializer

from ..main.validation import admin_required, owner_required

from ...models import User, Identity


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
    first_name = request.data.get('first_name')
    last_name = request.data.get('last_name')
    email = request.data.get('email')
    phone = request.data.get('phone')
    password = request.data.get('password')
    dob = request.data.get('dob')
    address = request.data.get('address')
    city = request.data.get('city')
    postcode = request.data.get('postcode')
    
    # Create the user
    user = User.objects.create_owner(email=email, phone=phone, password=password, first_name=first_name, last_name=last_name, dob=dob,address=address, city=city, postcode=postcode)
    user.save()
    return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)
  except Exception as e:
    print(f"Error: {e}")
    return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
  
  
  
@api_view(['POST'])
@permission_classes([IsAuthenticated])
@admin_required
def onboard_employee(request):
  # Get the request data
  email = request.data.get('email')
  phone = request.data.get('phone')
  password = request.data.get('password')
  first_name = request.data.get('first_name')
  last_name = request.data.get('last_name')
  dob = request.data.get('dob')
  role = request.data.get('role')
  id_type = request.data.get('id_type')
  id_front = request.data.get('id_front')
  id_back = request.data.get('id_back')
  
  if not request.data:
    return Response({'error': 'Please provide the user details'}, status=status.HTTP_400_BAD_REQUEST)
  
  # Since the owner is the only one with permission to create an admin
  # check the company asssociated with the request user(owner)
  company = request.user.company
    
  # Check the role
  # Use the role to direct the object creation
  # Create admin if role is admin and staff if role is staff
  # Return the valid responses
  try:
    if role == 'admin':
      user = User.objects.create_admin(email=email, phone=phone, password=password, first_name=first_name, last_name=last_name, dob=dob, company=company, date_hired=datetime.now())
      
      # Create the identity object and associate it with the user
      identity = Identity.objects.create(user=user, id_type=id_type, id_front=id_front, id_back=id_back)
      
      identity.save()
      user.save()# Save the user object
      return Response({'message': 'Admin created successfully'}, status=status.HTTP_201_CREATED)
    elif role == 'staff':
      user = User.objects.create_staff(email=email, phone=phone, password=password, first_name=first_name, last_name=last_name, dob=dob, company=company, date_hired=datetime.now())
      
      # Create the identity object and associate it with the user
      identity = Identity.objects.create(user=user, id_type=id_type, id_front=id_front, id_back=id_back)
      identity.save()
      user.save()
      return Response({'message': 'Staff created successfully'}, status=status.HTTP_201_CREATED)
  except Exception as e:
    return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
  
  
  
@api_view(['POST'])
@permission_classes([IsAuthenticated])
@admin_required
def register_staff(request):
  # Get the request data
  email = request.data.get('email')
  phone = request.data.get('phone')
  password = request.data.get('password')
  first_name = request.data.get('first_name')
  last_name = request.data.get('last_name')
  dob = request.data.get('dob')
  role = request.data.get('role')
  try:
    if role == 'staff':
      user = User.objects.create_staff(email=email, phone=phone, password=password, first_name=first_name, last_name=last_name, dob=dob, date_hired=datetime.now())
      user.save()
      return Response({'message': 'Staff created successfully'}, status=status.HTTP_201_CREATED)
  except Exception as e:
    return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
  
  