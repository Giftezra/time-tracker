from datetime import datetime
from rest_framework.decorators import api_view, permission_classes, throttle_classes
from django.shortcuts import get_object_or_404
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.throttling import AnonRateThrottle
from django.core.cache import cache
from django_ratelimit.decorators import ratelimit
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
@ratelimit(key='ip', rate='10/h', block=True, method=['POST'])
@api_view(['POST'])
@permission_classes([AllowAny])
def register_owner(request):
    # Check if the request data is empty
    if not request.data:
        return Response({'error': 'Please provide the user details'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Map frontend field names to backend field names
        required_fields = ['first_name', 'last_name', 'email', 'phone', 'password', 'dob', 'address1', 'city', 'postcode']
        
        # Print missing fields for debugging
        missing_fields = [field for field in required_fields if not request.data.get(field)]
        if missing_fields:
            return Response({'error': f'Missing required fields: {", ".join(missing_fields)}'}, status=status.HTTP_400_BAD_REQUEST)
        
        validated_data = {
            'first_name': request.data.get('first_name'),
            'last_name': request.data.get('last_name'),
            'email': request.data.get('email').lower(),  
            'phone': request.data.get('phone'),
            'password': request.data.get('password'),
            'dob': request.data.get('dob'),
            'address': request.data.get('address1'),  
            'city': request.data.get('city'),
            'postcode': request.data.get('postcode')
        }
        
        # Create the user
        user = User.objects.create_owner(
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            phone=validated_data['phone'],
            dob=validated_data['dob'],
            address=validated_data['address'],
            city=validated_data['city'],
            postcode=validated_data['postcode']
        )
        user.save()
        
        # Send a welcome email to the owner after user is created
        send_owner_onboarding_email.delay(validated_data['email'])

        return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)
    except Exception as e:
        print(f"Error: {e}")
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
  
  