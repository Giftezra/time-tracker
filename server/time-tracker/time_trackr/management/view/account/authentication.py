from datetime import datetime
from rest_framework.decorators import api_view, permission_classes, throttle_classes
from django.shortcuts import get_object_or_404
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.throttling import AnonRateThrottle
from django.core.cache import cache
import requests
from time import sleep

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
  
  
@api_view(['GET'])
@throttle_classes([AnonRateThrottle])
def lookup_address(request):
    print('Lookup address')
    """
    Lookup addresses for a given postcode using Nominatim API
    GET /api/v1/addresses/?postcode=POSTCODE
    """
    postcode = request.data.get('postcode')
    if not postcode:
        return Response({'error': 'Postcode is required'}, status=400)

    # Check cache first
    cache_key = f'postcode_{postcode}'
    cached_addresses = cache.get(cache_key)
    if cached_addresses:
        return Response(cached_addresses)
    print('Cache miss', cached_addresses)

    try:
        # Add a small delay to respect rate limiting (1 request per second)
        sleep(1)

        # Query Nominatim API
        response = requests.get(
            'https://nominatim.openstreetmap.org/search',
            params={
                'postalcode': postcode,
                'country': 'GB',
                'format': 'json',
                'addressdetails': 1,
                'limit': 10
            },
            headers={
                # IMPORTANT: Replace with your actual application name and contact email
                'User-Agent': 'TimeTracker/1.0 (giftezraifeanyi@gmail.com)'
            },
            timeout=5
        )

        response.raise_for_status()
        data = response.json()
        print('Data', data)
        
        addresses = []
        for item in data:
            address_details = item.get('address', {})
            
            # Extract and format address components
            building = address_details.get('building', '')
            house_number = address_details.get('house_number', '')
            street = address_details.get('road', '')
            suburb = address_details.get('suburb', '')
            city = (
                address_details.get('city', '') or 
                address_details.get('town', '') or 
                address_details.get('village', '')
            )
            
            # Construct address line 1
            address1_parts = []
            if building:
                address1_parts.append(building)
            if house_number:
                address1_parts.append(house_number)
            if street:
                address1_parts.append(street)
            
            address1 = ' '.join(address1_parts).strip()
            
            if address1 and city:
                address = {
                    'address1': address1,
                    'city': city,
                    'postcode': postcode,
                    'suburb': suburb
                }
                addresses.append(address)

        if addresses:
            # Cache successful results for 24 hours
            cache.set(cache_key, addresses, 60 * 60 * 24)
            return Response(addresses)
        else:
            return Response({
                'error': 'No addresses found for this postcode'
            }, status=404)

    except requests.Timeout:
        return Response({
            'error': 'Request timed out. Please try again.'
        }, status=504)
        
    except requests.RequestException as e:
        return Response({
            'error': f'Failed to fetch addresses: {str(e)}'
        }, status=500)
  
  