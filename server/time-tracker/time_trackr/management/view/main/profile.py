from django.forms import ValidationError
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from django.shortcuts import get_object_or_404

from ...models import Company

from .decorators import owner_required
from ...tasks import send_create_company_email


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@owner_required
def create_company(request):
    try:
        if not request.data:
            return Response({'error': 'No data provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        required_fields = ['name', 'email', 'address', 'postcode', 'city', 'country', 'website', 'services', 'helpline']

        # Get the request user email
        user_email = request.user.email

        # Check if all required fields are provided
        for field in required_fields:
            data = {}
            data[field] = request.data.get(field)
            if not data[field]:
                return Response({'error': f'{field} is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Create the company
        company = Company.objects.create(
            owner=request.user,
            name=data['name'],
            email=data['email'],
            address=data['address'],
            postcode=data['postcode'],
            city=data['city'],
            country=data['country'],
            website=data['website'],
            services=data['services'],
            helpline=data['helpline'],
        )
        company.save()
        # Send an email to the user with the company details to confirm the creation of the company
        send_create_company_email.delay(company.name, company.registration_number, company.email, company.helpline, user_email)
        
        # Return a success message if the company is created successfully
        return Response({'message': 'Company created successfully'}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    

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
        

