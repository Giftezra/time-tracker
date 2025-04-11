import datetime
from django.forms import ValidationError
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils import timezone
from django.db import models

from django.shortcuts import get_object_or_404
from django.db.models import Count, Q
from django.db.models.functions import ExtractMonth

from ...models import Company, Contracts, Client
from staff.models import Staff, Availability, Leave
from management.models import Task, Shift

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
  """ This method retrieves details of staff members who have their birthday today.
  Returns a list containing employee information including their ID, name, email, role, and age."""
    
  try:
    # Check if the user is an owner or staff and get the associated company
    if request.user.is_owner:
      company = get_object_or_404(Company, owner=request.user)
    elif request.user.is_employee:
      company = get_object_or_404(Staff, user=request.user).company 
      
    # Get today's date
    today = timezone.now().date()
    
    # Filter staffs with birthdays today
    staffs = Staff.objects.filter(
      company=company,
      user__dob__month=today.month,
      user__dob__day=today.day
    )

    todays_events = []
    
    for staff in staffs:
      # Calculate age
      age = today.year - staff.user.dob.year
      # Adjust age if birthday hasn't occurred this year
      if today < datetime.date(today.year, staff.user.dob.month, staff.user.dob.day):
        age -= 1

      todays_events.append({
        'name': staff.user.get_full_name(),
      })

    return Response({
      "events": todays_events,
    }, status=status.HTTP_200_OK)
          
  except Company.DoesNotExist:
    return Response({"error": "This user is unassigned to a company"}, status=status.HTTP_400_BAD_REQUEST)
  except Exception as e:
    return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


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
            year = int(request.GET.get('year'))
            print('contract year', year)
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
                'label': months[month_num],
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
    


@api_view(['GET'])
@permission_classes([IsAuthenticated])
@admin_required
def get_employees_on_leave(request):
   """ Get the list of employees who are on leave or currently unavailable for whatever reason.
   Returns details including when they started their leave/unavailability and when they will return.
   """

   try:
      # Get the company based on the user's role
      try:
         if request.user.is_owner:
            company = get_object_or_404(Company, owner=request.user)
         elif request.user.is_employee:
            staff = get_object_or_404(Staff, user=request.user)
            company = staff.company
         else:
            return Response({
               "error": "You are not authorized to access this resource"
            }, status=status.HTTP_403_FORBIDDEN)
      except Staff.DoesNotExist or Company.DoesNotExist:
         return Response({
            "error": "Staff or Company not found"
         }, status=status.HTTP_404_NOT_FOUND)

      # Parse the date parameter correctly
      date_str = request.GET.get('date')
      if not date_str:
         return Response({
            "error": "Date parameter is required"
         }, status=status.HTTP_400_BAD_REQUEST)
      
      current_date = datetime.datetime.strptime(date_str, '%Y-%m-%d').date()
      
      unavailable_employees = []

      # Get the employees associated with the company
      employees = Staff.objects.filter(company=company)
      for employee in employees:
         # Check for approved leaves
         leave_status = Leave.objects.filter(
            staff=employee,
            end_date__gte=current_date,
            status__in=['approved', 'on_leave']
         ).first()
         # Check for unavailability periods
         unavailability = Availability.objects.filter(
            staff=employee,
            end_date__gte=current_date
         ).first()

         if leave_status:
            if leave_status:
               employee_status = leave_status.status if leave_status else 'unavailable'
            unavailable_employees.append({
               'employee_id': employee.id,
               'name': employee.user.get_full_name(),
               'email': employee.user.email,
               'type': 'leave',
               'status': employee_status,
               'start_date': leave_status.start_date,
               'end_date': leave_status.end_date,
            })
         
         if unavailability:
            unavailable_employees.append({
               'employee_id': employee.id,
               'name': employee.user.get_full_name(),
               'email': employee.user.email,
               'type': 'unavailability',
               'status': 'unavailable',
               'start_date': unavailability.start_date,
               'end_date': unavailability.end_date,
            })

      # Return response after processing all employees
      return Response({"unavailable_employees": unavailable_employees}, status=status.HTTP_200_OK)

   except ValueError as e:
      return Response({"error": "Invalid date format. Use YYYY-MM-DD"}, status=status.HTTP_400_BAD_REQUEST)
   except Exception as e:
      return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
   


@api_view(['GET'])
@permission_classes([IsAuthenticated])
@admin_required
def get_task_statistics(request):
    """Get task statistics for the company dashboard"""
    try:
        # Get the company based on the user's role
        if request.user.is_owner:
            company = get_object_or_404(Company, owner=request.user)
        elif request.user.is_employee:
            company = get_object_or_404(Staff, user=request.user).company
        else:
            return Response({
               "error": "You are not authorized to access this resource"
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Get all tasks through staff shifts for the company
        tasks = Shift.objects.filter(
            task__contract__client__company=company
        )
        
        # Calculate statistics
        total_tasks = tasks.count()
        completed_tasks = tasks.filter(status='completed').count()
        ongoing_tasks = tasks.filter(status='started').count()
        pending_tasks = tasks.filter(status='pending').count()
        assigned_tasks = tasks.filter(status='assigned').count()
        
        # Return the statistics
        statistics = {
            'total': total_tasks,
            'completed': completed_tasks,
            'ongoing': ongoing_tasks,
            'pending': pending_tasks,
            'assigned': assigned_tasks
        }

        return Response({'statistics': statistics}, status=status.HTTP_200_OK)
    except Staff.DoesNotExist:
        return Response({'error': 'User is not associated with any company'}, status=400)
    except Exception as e:
        return Response({'error': str(e)}, status=500)
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@admin_required
def get_top_performers(request):
    """
    Get top performing staff members based on completed shifts.
    Staff are ranked by their completed shifts count.
    
    Returns:
        Response: JSON containing list of top 10 performers with their details
        
    Format:
        {
            'top_performers': [
                {
                    'id': str,
                    'name': str,
                    'email': str,
                    'phone': str,
                    'role': str,
                    'taskCompleted': int,
                    'rank': int
                },
                ...
            ]
        }
    """
    try:
        # Get the company based on the user's role
        if request.user.is_owner:
            company = get_object_or_404(Company, owner=request.user)
        elif request.user.is_employee:
            company = get_object_or_404(Staff, user=request.user).company

        # Get all shifts through tasks that belong to the company
        shifts = Shift.objects.filter(
            task__contract__client__company=company
        )

        # Get the top 10 performers based on the number of tasks completed
        # and the number of task not cancelled  
        top_performers = shifts.values('staff').annotate(
            task_completed=Count('id')
        ).order_by('-task_completed' )[:10]

        # Get the data for the top performers
        performers_data = []
        for rank, performer in enumerate(top_performers, 1):
            staff = Staff.objects.get(id=performer['staff'])
            role = "Admin" if staff.user.is_admin else "Employee"
            performers_data.append({
                'id': str(staff.id),
                'name': staff.user.get_full_name(), 
                'email': staff.user.email,
                'phone': staff.user.phone,
                'role': role,
                'taskCompleted': performer['task_completed'],
                'rank': rank
            })
        # Return the data to the client
        return Response({
            'top_performers': performers_data
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)
    

