from rest_framework.decorators import api_view, permission_classes  
from rest_framework.permissions import IsAuthenticated
from ...models import User,Company,Shift
from ...serializer import UserSerializer

from .decorators import admin_required

from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from django.conf import settings
from rest_framework import status
from staff.models import Staff,TimeSheet

from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from django.core.mail import EmailMessage, send_mail
import io
from datetime import datetime

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@admin_required
def get_shifts(request):
    """
    Retrieve all shifts for a company based on user authorization.
    
    Args:
        request: HTTP request object containing user authentication
        
    Returns:
        Response object with:
        - shifts: List of shift details including employee assignments
        - HTTP 200: Success with shifts or empty list
        - HTTP 403: If user is not authorized
        - HTTP 400: For any other errors
        
    Authorization:
        - Company owners can access all shifts in their company
        - Admin users can access shifts for their assigned company
    """
    try:
        # Check if the user is an admin or the owner and get the company associated with the user
        if request.user.is_owner:
            company = get_object_or_404(Company, owner=request.user)
        elif request.user.is_admin:
            employee = get_object_or_404(Staff, user=request.user)
            company = employee.company
        else:
            return Response({'error': 'You are not authorized to access this resource'}, status=status.HTTP_403_FORBIDDEN)
            
        # Get all contracts and tasksassociated with the company using the filter method to filter the associated company shifts.
        shifts = Shift.objects.filter(task__contract__client__company=company)
        
        if not shifts:
            return Response({'error': 'No shifts found'}, status=status.HTTP_200_OK)
        
        shift_list = []
        
        # Append the details of each shift to the shift list
        for shift in shifts:
            # Get the employees assigned to a task
            employees = shift.staff.all()
            for employee in employees:
                shift_list.append({
                    'shiftId':(int(shift.id)),
                    'employeeId':(int(employee.id)),
                    'start_date' : shift.start_date,
                    'end_date' : shift.end_date,
                    'start_time': shift.task.start_time,
                    'end_time': shift.task.end_time,
                    'status': shift.status,
                    'tast_serial' : shift.task.task_serial,
                    'client': shift.task.contract.client.name,
                })
        return Response({'shifts': shift_list}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    

def generate_report_content(shifts):
    """
    Format shift data into a structured format for PDF report generation.
    
    Args:
        shifts (QuerySet): QuerySet of Shift objects with related task, client, 
                          and employee information
    
    Returns:
        list: List of dictionaries containing formatted shift information including:
            - shift_id: Unique identifier for the shift
            - employee_name: Full name of assigned employee
            - task: Task serial number
            - client: Client name
            - start_date: Formatted start date (YYYY-MM-DD)
            - end_date: Formatted end date (YYYY-MM-DD)
            - start_time: Formatted start time (HH:MM)
            - end_time: Formatted end time (HH:MM)
            - status: Current status of the shift
    """
    report_content = []
    for shift in shifts:
        employees = shift.staff.all()
        for employee in employees:
            report_content.append({
                'shift_id': shift.id,
                'employee_name': f"{employee.user.first_name} {employee.user.last_name}",
                'task': shift.task.task_serial,
                'client': shift.task.contract.client.name,
                'start_date': shift.task.start_date.strftime('%Y-%m-%d'),
                'end_date': shift.task.end_date.strftime('%Y-%m-%d'),
                'start_time': shift.task.start_time.strftime('%H:%M'),
                'end_time': shift.task.end_time.strftime('%H:%M'),
                'status': shift.status,
            })
    return report_content

def generate_pdf_report(report_content, start_date, end_date):
    """
    Generate a formatted PDF report containing shift information.
    
    Args:
        report_content (list): List of dictionaries containing shift data
        start_date (str): Start date of the report period
        end_date (str): End date of the report period
        
    Returns:
        bytes: PDF file content as bytes
        
    PDF Format:
        - Title with date range
        - Table containing:
            * Shift ID
            * Employee Name
            * Task
            * Client
            * Start/End Dates
            * Start/End Times
            * Status
        - Styled with:
            * Grey header background
            * Beige row background
            * Centered alignment
            * Grid lines
    """
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    elements = []
    
    # Add title and date range
    styles = getSampleStyleSheet()
    elements.append(Paragraph(f"Shift Report ({start_date} to {end_date})", styles['Heading1']))
    elements.append(Spacer(1, 20))
    
    # Prepare table data
    table_data = [['Shift ID', 'Employee', 'Task', 'Client', 'Start Date', 'End Date', 'Start Time', 'End Time', 'Status']]
    for item in report_content:
        table_data.append([
            str(item['shift_id']),
            item['employee_name'],
            item['task'],
            item['client'],
            item['start_date'],
            item['end_date'],
            item['start_time'],
            item['end_time'],
            item['status']
        ])
    
    # Create and style the table
    table = Table(table_data)
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 12),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('TEXTCOLOR', (0, 1), (-1, -1), colors.black),
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 1), (-1, -1), 10),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    
    elements.append(table)
    doc.build(elements)
    
    return buffer.getvalue()

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@admin_required
def email_shift_report(request):
    """
    Generate and email a PDF report of shifts within a specified date range.
    
    Args:
        request: HTTP request object containing:
            - start_date (str): Start date for shift report
            - end_date (str): End date for shift report
            
    Returns:
        Response object with:
        - HTTP 200: Success message when email is sent
        - HTTP 400: If dates are missing or invalid
        - HTTP 404: If no shifts found in date range
        
    Process:
        1. Validates input dates
        2. Retrieves shifts within date range
        3. Generates PDF report
        4. Emails report to user's email address
        
    Email Content:
        - Subject: Shift Report with date range
        - Body: Brief message
        - Attachment: PDF report named 'shift_report_<start_date>_to_<end_date>.pdf'
    """
    try:
        start_date = request.data.get('start_date')
        end_date = request.data.get('end_date')

        # Validate the start and end dates
        if not start_date or not end_date:
            return Response({'error': 'Start and end dates are required'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Get all shifts for the given date range
        shifts = Shift.objects.filter(
            start_time__date__range=(start_date, end_date),
            status__in=['completed', 'started', 'assigned']
        ).select_related(
            'task__contract__client',
        ).prefetch_related('staff__user')

        if not shifts:
            return Response({'error': 'No shifts found for the specified date range'}, status=status.HTTP_404_NOT_FOUND)

        # Generate report content
        report_content = generate_report_content(shifts)
        
        # Generate PDF
        pdf_content = generate_pdf_report(report_content, start_date, end_date)
        
        # Send email with PDF attachment
        subject = f'Shift Report ({start_date} to {end_date})'
        message = f'Please find attached the shift report for the period {start_date} to {end_date}.'
        from_email = 'giftezraifeanyi1@gmail.com'
        recipient_list = [request.user.email]
        
        # Create EmailMessage instance for attachment support
        email = EmailMessage(
            subject=subject,
            body=message,
            from_email=from_email,
            to=recipient_list
        )
        email.attach(f'shift_report_{start_date}_to_{end_date}.pdf', pdf_content, 'application/pdf')
        
        # Send the email
        send_mail(
            subject=subject,
            message=message,
            from_email=from_email,
            recipient_list=recipient_list,
            fail_silently=False,
            html_message=message  # Optional HTML version of the message
        )

        return Response({'message': 'Report has been sent to your email'}, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
@admin_required
def cancel_shift(request):
    """
    Remove an employee from a shift without canceling the entire shift.
    
    Args:
        request: HTTP request object containing:
            - shift_id: ID of the shift
            - employee_id: ID of the employee to remove
            
    Returns:
        Response object with:
        - HTTP 200: Success message when employee is removed
        - HTTP 400: For invalid requests or errors
        - HTTP 404: If shift or employee not found
    """
    shift_id = request.data.get('shift_id')
    employee_id = request.data.get('employee_id')

    # Get the shift and employee
    try:
        shift = get_object_or_404(Shift, id=shift_id)
        employee = get_object_or_404(Staff, id=employee_id)
    except Shift.DoesNotExist as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    except Staff.DoesNotExist as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Check if the employee is in the shift
        if employee not in shift.staff.all():
            return Response({'message': 'Employee is not in the shift'}, status.HTTP_200_OK)
        
        # Check if the shift can be modified
        if shift.status in ['completed', 'cancelled']:
            return Response(
                {'message': f'Cannot remove employee - shift is {shift.status}'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        # Check if the shift is already started
        if shift.status == 'started':
            return Response({'message': 'Shift is already started'}, status=status.HTTP_400_BAD_REQUEST)

        # Remove the employee from the shift
        shift.staff.remove(employee)
        
        # If this was the last employee, mark the shift as cancelled
        if shift.staff.count() == 0:
            shift.status = 'cancelled'
            shift.save()
            return Response({
                'message': 'Employee removed and shift cancelled as no employees remain'
            }, status=status.HTTP_200_OK)
            
        return Response({
            'message': 'Employee removed from shift successfully'
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
@admin_required
def update_shift(request):
    """
    Update a shift given the shift id, employee id, date, start time, and end time.
    """
    shift_id = request.data.get('shift_id')
    employee_id = request.data.get('employee_id')
    date = request.data.get('date')
    start_time = request.data.get('start_time')
    end_time = request.data.get('end_time')

    try:
        shift = get_object_or_404(Shift, id=shift_id)
        employee = get_object_or_404(Staff, id=employee_id)
    except Shift.DoesNotExist as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    except Staff.DoesNotExist as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # check if the employee is in the shift
        if employee not in shift.staff.all():
            return Response({'message': 'Employee is not in the shift'}, status.HTTP_200_OK)
        
        # check if the shift is already cancelled
        if shift.status == 'cancelled':
            return Response({'message': 'Shift is already cancelled'}, status=status.HTTP_200_OK)
        elif shift.status == 'completed':
            return Response({'message': 'Shift is already completed'}, status=status.HTTP_200_OK)
        elif shift.status in ['started', 'pending', 'assigned']:
            # Update the shift details
            shift.task.start_date = date
            shift.task.start_time = start_time
            shift.task.end_time = end_time
            shift.task.save()
            shift.save()
            return Response({'message': 'Shift updated successfully'}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
@admin_required
def approve_shift(request):
    """
    Approve a shift given the shift id and the employee id.
    
    Args:
        request: HTTP request object containing:
            - shift_id: ID of the shift to approve
            - employee_id: ID of the employee whose timesheet to approve
            
    Returns:
        Response object with:
        - HTTP 200: Success message when shift is approved
        - HTTP 400: For invalid requests or errors
        - HTTP 404: If shift or employee not found
    """
    shift_id = request.data.get('shift_id')
    employee_id = request.data.get('employee_id')

    try:
        shift = get_object_or_404(Shift, id=shift_id)
        employee = get_object_or_404(Staff, id=employee_id)

        # Check if the employee is in the shift
        if employee not in shift.staff.all():
            return Response({'message': 'Employee is not assigned to this shift'}, status=status.HTTP_400_BAD_REQUEST)

        # Get the timesheet entry for this shift and employee
        time_sheet = get_object_or_404(TimeSheet, shift=shift, staff=employee)
        
        if time_sheet.status == 'approved':
            return Response({'message': 'Timesheet is already approved'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Update the timesheet status to approved
        time_sheet.status = 'approved'
        time_sheet.save()

        return Response({'message': 'Shift timesheet approved successfully'}, status=status.HTTP_200_OK)
    except TimeSheet.DoesNotExist:
        return Response({'error': 'No timesheet found for this shift and employee'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    

