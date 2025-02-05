import datetime
from django.forms import ValidationError
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from django.shortcuts import get_object_or_404
from django.db.models import Count
from django.db.models.functions import ExtractMonth

from ...models import Company, Contracts, Client
from staff.models import Staff, Availability, Leave
from staff.models import Leave
from staff.models import Availability

from .decorators import owner_required, staff_required, admin_required, superuser_required



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
    
  try:
    # Check if the user is an owner or staff and use the associated company to initialize the company variable
    if request.user.is_owner:
      company = get_object_or_404(Company, owner=request.user)
    elif request.user.is_employee:
      company = get_object_or_404(Staff, user=request.user).company 
      

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
def get_unavailable_employees(request):
    """ This method is designed to retrieve the employees who are not available for work or on leave """

    try:
        # Get the company associated with the request user
        if request.user.is_owner:
            company = get_object_or_404(Company, owner=request.user)
        elif request.user.is_employee or request.user.is_admin:
            company = get_object_or_404(Staff, user=request.user).company

        # Get the employees associated with the company
        employees = Staff.objects.filter(company=company)
        
        # Get current date and time
        current_date = datetime.date.today()
        current_time = datetime.datetime.now().time()
        
        unavailable_employees = []
        
        # Check each employee's availability and leave status
        for employee in employees:
            # Check if employee is on leave or approved for leave
            leave_status = Leave.objects.filter(
                staff=employee,
                start_date__lte=current_date,
                end_date__gte=current_date
            ).exclude(status=['available', 'pending']).first()
            
            # Check if employee is unavailable based on availability schedule
            unavailable = Availability.objects.filter(
                staff=employee,
                start_date__lte=current_date,
                end_date__gte=current_date,
                start_time__lte=current_time,
                end_time__gte=current_time
            ).exists()
            
            if leave_status or unavailable:
                status = leave_status.status if leave_status else 'Unavailable'
                unavailable_employees.append({
                    'id': employee.id,
                    'name': employee.user.get_full_name(),
                    'status': status
                })
        
        return Response({
            'unavailable_employees': unavailable_employees
        }, status=status.HTTP_200_OK)
        
    except Staff.DoesNotExist:
        return Response({
            "error": "Staff not found"
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            "error": str(e)
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
@admin_required
def get_contract_statistics(request):
    """Get monthly statistics for contracts and clients"""
    try:
        # Get the company based on the user's role
        if request.user.is_owner:
            company = get_object_or_404(Company, owner=request.user)
        elif request.user.is_employee:
            company = get_object_or_404(Staff, user=request.user).company

        # Get the year from query params or use current year
        try:
            year = int(request.GET.get('year', datetime.datetime.now().year))
        except ValueError:
            return Response({
                'error': 'Invalid year parameter'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Initialize data for all months with zeros
        months_data = {month: {'clients': 0, 'contracts': 0} for month in range(1, 13)}
        
        # Get monthly counts for clients
        clients_by_month = Client.objects.filter(
            company=company,
            created_at__year=year
        ).annotate(
            month=ExtractMonth('created_at')
        ).values('month').annotate(
            count=Count('id')
        )

        # Get monthly counts for contracts through clients that belong to the company
        contracts_by_month = Contracts.objects.filter(
            client__company=company,  # Filter contracts through client's company
            created_at__year=year
        ).annotate(
            month=ExtractMonth('created_at')
        ).values('month').annotate(
            count=Count('id')
        )

        # Update the months_data with actual counts
        for item in clients_by_month:
            months_data[item['month']]['clients'] = item['count']
        
        for item in contracts_by_month:
            months_data[item['month']]['contracts'] = item['count']

        # Convert to the format needed by the frontend chart
        months = {
            1: 'Jan', 2: 'Feb', 3: 'Mar', 4: 'Apr', 5: 'May', 6: 'Jun',
            7: 'Jul', 8: 'Aug', 9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dec'
        }

        statistics = []
        for month_num, counts in months_data.items():
            # Add client data
            statistics.append({
                'value': counts['clients'],
                'label': months[month_num] if month_num % 2 != 0 else '',
                'spacing': 2,
                'labelWidth': 30 if months[month_num] in ['Mar', 'Apr', 'Sept', 'Oct'] else 20,
                'frontColor': '#177AD5'
            })
            # Add contract data
            statistics.append({
                'value': counts['contracts'],
                'frontColor': '#ED6665'
            })

        return Response({
            'statistics': statistics,
            'year': year
        }, status=status.HTTP_200_OK)

    except Company.DoesNotExist:
        return Response({
            'error': 'Company not found'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)

