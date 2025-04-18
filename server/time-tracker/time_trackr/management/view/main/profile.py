from django.forms import ValidationError
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django_ratelimit.decorators import ratelimit
from ...models import Company
from .decorators import owner_required
from ...tasks import send_create_company_email


@ratelimit(key='ip', rate='5/h', block=True, method=['POST'])
@api_view(['POST'])
@permission_classes([IsAuthenticated])
@owner_required
def create_company(request):
    """ Create a company for the owner and send an email to the user with the company details to confirm the creation of the company. 
     The method is set to limit the number of requests to 5 per hour to prevent abuse. """
    try:
        if not request.data:
            return Response({'error': 'No data provided'}, status=status.HTTP_400_BAD_REQUEST)
            
        required_fields = ['company_name', 'company_email', 'company_address', 'company_postcode', 
                         'company_city', 'company_country', 'company_website', 'company_services', 
                         'company_helpline', 'company_registration_number']
        
        # Check if all required fields are provided in the request data
        missing_fields = [field for field in required_fields if not request.data.get(field)]
        if missing_fields:
            return Response({'error': f'Missing required fields: {", ".join(missing_fields)}'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        # Create the company and save it to the database
        company = Company.objects.create(
            owner=request.user,
            name=request.data['company_name'],
            email=request.data['company_email'],
            address=request.data['company_address'],
            postcode=request.data['company_postcode'],
            city=request.data['company_city'],
            country=request.data['company_country'],
            website=request.data['company_website'],
            services=request.data['company_services'],
            helpline=request.data['company_helpline'],
            registration_number=request.data['company_registration_number'],
        )
        
        # Send an email to the user with the company details
        # send_create_company_email.delay(company.name, company.registration_number, 
        #                               company.email, company.helpline, request.user.email)
        
        return Response({'message': 'Company created successfully'}, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        print('Error creating company:', str(e))  # Add logging for debugging
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
@ratelimit(key='user', rate='6/m', block=True, method=['PATCH'])
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_user_preferences(request):
    try:
        if not request.data:
            return Response({'error': 'No data provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        user = request.user
        user.allow_email_notification = request.data.get('allow_email_notification')
        user.allow_push_notification = request.data.get('allow_push_notification')
        user.allow_marketing_emails = request.data.get('allow_marketing_emails')
        user.save()
        new_user_notification = {
            'allow_email_notification': user.allow_email_notification,
            'allow_push_notification': user.allow_push_notification,
            'allow_marketing_emails': user.allow_marketing_emails
        }
        return Response({'new_data': new_user_notification}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
@ratelimit(key='user', rate='4/h', block=True, method=['PATCH'])
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
@owner_required
def update_owner_company_details(request):
    try:
        if not request.data:
            return Response({'error': 'No data provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        data = request.data.get('data')
        print(data)
        company_name = data.get('company_name')
        company_address = data.get('company_address')
        company_postcode = data.get('company_postcode')
        company_website = data.get('company_website')
        company_services = data.get('company_services')
        company_helpline = data.get('company_helpline')
        company_email = data.get('company_email')
        firstname = data.get('firstname')
        lastname = data.get('lastname')
        email = data.get('email')
        phone = data.get('phone')
        dob = data.get('dob')
        
        # Get the company object associated with the owner
        company = Company.objects.get(owner=request.user)
        user = request.user
        # Update the user details and the company details
        if firstname:
            user.firstname = firstname
        if lastname:
            user.lastname = lastname
        if email:
            user.email = email
        if phone:
            user.phone = phone
        if dob:
            user.dob = dob
        if company_name:
            company.name = company_name
        if company_address:
            company.address = company_address
        if company_postcode:
            company.postcode = company_postcode
        if company_website:
            company.website = company_website
        if company_services:
            company.services = company_services
        if company_helpline:
            company.helpline = company_helpline
        if company_email:
            company.email = company_email
        request.user.save()
        company.save()
        return Response({'message': 'Company details updated successfully'}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

            

        

