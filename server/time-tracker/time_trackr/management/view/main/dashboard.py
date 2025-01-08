from django.forms import ValidationError
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from django.shortcuts import get_object_or_404

from ...models import Company

from .validation import owner_required, staff_required, admin_required, superuser_required

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@owner_required
def create_company(request):
    # Check the request data is valid and return an error if not
    if not request.data:
        return Response({"error": "Company details are required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
      company = Company.objects.create(
        owner=request.user,
        name=request.data.get('name'),
        email=request.data.get('email'),
        helpline=request.data.get('helpline'),
        address=request.data.get('address'),
        postcode=request.data.get('postcode'),  
        city=request.data.get('city'),
        country=request.data.get('country'),
        services=request.data.get('services'),
        website=request.data.get('weblink'),
      )
    except ValidationError as e:
      return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    # Associate the user with the company
    request.user.company = company
    company.save()
    return Response({"message": "Company created successfully"}, status=status.HTTP_201_CREATED)
  



@api_view(['PUT'])
@permission_classes([IsAuthenticated])
@owner_required
def update_company(request):
   # Check the request data is valid and return an error if not
  if not request.data:
    return Response({"error": "Company details are required"}, status=status.HTTP_400_BAD_REQUEST)
  
  try:
    company = get_object_or_404(Company, owner=request.user)
      # Update the company details with the request data
      # or keep the existing details if no data is provided
    company.name = request.data.get('name', company.name)
    company.email = request.data.get('email', company.email)
    company.helpline = request.data.get('helpline', company.helpline)
    company.address = request.data.get('address', company.address)
    company.postcode = request.data.get('postcode', company.postcode)
    company.city = request.data.get('city', company.city)
    company.country = request.data.get('country', company.country)
    company.services = request.data.get('services', company.services)
    company.website = request.data.get('website', company.website)
    
    company.save()
    return Response({"message": "Company updated successfully"}, status=status.HTTP_200_OK)
  except Company.DoesNotExist:
    return Response({"error": "This user is unassigned to a company"}, status=status.HTTP_400_BAD_REQUEST)

 
 

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
@owner_required
def delete_company(request):
  company = get_object_or_404(Company, owner=request.user)
  try:
    company.delete()
    return Response({"message": "Company deleted successfully"}, status=status.HTTP_200_OK)
  except Exception as e:
    return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

