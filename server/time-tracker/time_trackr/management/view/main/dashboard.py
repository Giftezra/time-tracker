import datetime
from django.forms import ValidationError
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from django.shortcuts import get_object_or_404

from ...models import Company
from staff.models import Staff

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
  """ This method is used to delete the company associated with the owner. """
  company = get_object_or_404(Company, owner=request.user)
  try:
    company.delete()
    return Response({"message": "Company deleted successfully"}, status=status.HTTP_200_OK)
  except Exception as e:
    return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@admin_required
def get_today_events(request):
  """ This method is used to retrieve the date of birth of staff members associated with the company.
  The method checks through all the staffs and returns the details of the staff who has their birthday today."""
    
  company = None  # initialize the company variable to none
  try:
    # Get the company associated with the owner and the staff
    owner_company = get_object_or_404(Company, owner=request.user)
    staff_company = get_object_or_404(Staff, user=request.user)

    # Check if the user is an owner or staff and use the associated company to initialize the company variable
    if owner_company:
      company = owner_company
    elif staff_company:
      company = staff_company.company
      
    # Filter the staffs associated with the company and check if their date of birth is today
    today = datetime.date.today()
    staffs = Staff.objects.filter(company=company)
    todays_events = []

    for staff in staffs:
      if staff.user.dob.month == today.month and staff.user.dob.day == today.day:
        todays_events.append(staff)  # Append the staff to the staff_birthdays list if their date of birth is today

    return Response({"events": todays_events}, status=status.HTTP_200_OK) # Return the event list
          
  except Company.DoesNotExist:  # Return an error message if the user is not associated with a company
    return Response({"error": "This user is unassigned to a company"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
@admin_required
def get_employees_on_leave(request):
  """ This method is used to retrieve the staff members associated with the request users company who are not available for work or on leave """