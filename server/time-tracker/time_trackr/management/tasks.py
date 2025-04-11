""" This file contains the tasks that will be handled by celery when the management app is run. 
These methods will all be run in the background and will not return anything. """

from celery import shared_task
from django.core.mail import send_mail, EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings

from django.utils import timezone
from .models import SubscriptionPlan, Company, EmployeeCountHistory, Overage, Billing
from datetime import timedelta
from dateutil.relativedelta import relativedelta
from management.models import Shift
from management.helpers import send_notification

@shared_task
def send_staff_onboard_email(company_name, first_name, email, temporary_password, role, recipient_email):
  """ Method will send an email to the staff member with the onboarding details which will include the app store and play store urls
   to enable them to download the app and login to the app """
  context = {
    'company_name': company_name,
    'first_name': first_name,
    'email': email,
    'temporary_password': temporary_password,
    'role': role,
    'app_store_url': settings.APP_STORE_URL,
    'play_store_url': settings.PLAY_STORE_URL
  }
  html_message = render_to_string('emails/staff_onboard_email.html', context)
  plain_message = strip_tags(html_message)
  send_mail(
    subject='You have been added to Time Trackr',
    message=plain_message,
    html_message=html_message,
    from_email=settings.DEFAULT_FROM_EMAIL,
    recipient_list=[recipient_email],
    fail_silently=False
  )


@shared_task
def send_owner_onboarding_email(email):
  """ Method will send an email to the owner with the onboarding details which will include the app store and play store urls
   to enable them to download the app and login to the app """
  context = {
    'ios_app_link': settings.IOS_APP_LINK,
    'android_app_link': settings.ANDROID_APP_LINK,
    'support_email': settings.SUPPORT_EMAIL
  }
  html_message = render_to_string('emails/send_owner_onboarding_email.html', context)
  plain_message = strip_tags(html_message)
  send_mail(
    subject='Welcome to Time Trackr',
    message=plain_message,
    html_message=html_message,
    from_email=settings.DEFAULT_FROM_EMAIL,
    recipient_list=[email],
    fail_silently=False
  )


@shared_task
def send_create_company_email(name, registration_number, email, service_helpline):
  """ Method will send an email to the owner with the onboarding details which will include the app store and play store urls
   to enable them to download the app and login to the app """
  context = {
    'name': name,
    'registration_number': registration_number,
    'email': email,
    'service_helpline': service_helpline,
    'login_url': settings.LOGIN_URL
  }
  html_message = render_to_string('emails/create_email_confirmation.html', context)
  plain_message = strip_tags(html_message)
  send_mail(
    subject='Company Created Successfully',
    message=plain_message,
    html_message=html_message,
    from_email=settings.DEFAULT_FROM_EMAIL,
    recipient_list=[email],
    fail_silently=False
  )


@shared_task
def send_contract_created_email(client_name, contract_name, start_date, end_date, email):
  """ Method will send an email to the owner with the onboarding details which will include the app store and play store urls
   to enable them to download the app and login to the app """
  context = {
    'client_name': client_name,
    'contract_name': contract_name,
    'start_date': start_date,
    'end_date': end_date,
    'login_url': settings.LOGIN_URL
  }
  html_message = render_to_string('emails/create_contract.html', context)
  plain_message = strip_tags(html_message)
  send_mail(
    subject='A Team Member Has Created A New Contract',
    message=plain_message,
    html_message=html_message,
    from_email=settings.DEFAULT_FROM_EMAIL,
    recipient_list=[email],
    fail_silently=False
  )


@shared_task
def send_client_created_email(client_name, client_contact_number, client_email, services, email):
  """ Method will send an email to the owner with the onboarding details which will include the app store and play store urls
   to enable them to download the app and login to the app """
  context = {
    'client_name': client_name,
    'client_contact_number': client_contact_number,
    'client_email': client_email,
    'services': services,
    'login_url': settings.LOGIN_URL
  }
  html_message = render_to_string('emails/create_client.html', context)
  plain_message = strip_tags(html_message)
  send_mail(
    subject='A Team Member Has Created A New Client',
    message=plain_message,
    html_message=html_message,
    from_email=settings.DEFAULT_FROM_EMAIL,
    recipient_list=[email],
    fail_silently=False
  )


@shared_task
def send_contract_updated_email(contract_name, client_name, old_end_date, new_end_date, recipient_emails):
    """Send email notification when a contract is updated"""
    subject = f'Contract Updated: {contract_name}'
    context = {
        'contract_name': contract_name,
        'client_name': client_name,
        'old_end_date': old_end_date,
        'new_end_date': new_end_date
    }
    
    html_content = render_to_string('emails/contract_updated_email.html', context)
    text_content = strip_tags(html_content)
    
    email = EmailMultiAlternatives(
        subject,
        text_content,
        settings.DEFAULT_FROM_EMAIL,
        recipient_emails
    )
    email.attach_alternative(html_content, "text/html")
    email.send()



@shared_task
def send_trial_ending_email(company_name, days_left, owner_email):
    """Send email notification to company owner about trial period ending"""
    context = {
        'company_name': company_name,
        'days_left': days_left,
        'login_url': settings.LOGIN_URL,
        'support_email': settings.SUPPORT_EMAIL,
    }
    
    html_message = render_to_string('emails/trial_ending_notification.html', context)
    plain_message = strip_tags(html_message)
    
    send_mail(
        subject=f'Your Time Trackr Trial Ends in {days_left} Days',
        message=plain_message,
        html_message=html_message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[owner_email],
        fail_silently=False
    )



# Create a Celery task or cron job
def calculate_overage():
    companies = Company.objects.all()
    
    for company in companies:
        subscription = company.subscriptionplan
        billing_cycle_days = 30 if subscription.billing_cycle == 'monthly' else 365
        
        # Get daily counts for current billing cycle
        counts = EmployeeCountHistory.objects.filter(
            company=company,
            date__range=[subscription.start_date, subscription.renewal_date]
        )
        
        overage_days = 0
        max_overage = 0
        
        for entry in counts:
            if entry.count > subscription.tier:
                overage = entry.count - subscription.tier
                max_overage = max(max_overage, overage)
                overage_days += 1
        
        # Create Overage record
        if overage_days > 0:
            Overage.objects.create(
                subscription=subscription,
                start_date=subscription.start_date,
                end_date=subscription.renewal_date,
                extra_employees=max_overage,
                overage_days=overage_days
            )
            

              

def generate_bills():
    subscriptions = SubscriptionPlan.objects.filter(is_active=True)
    
    for sub in subscriptions:
        if timezone.now().date() == sub.renewal_date:
            # Calculate base charge
            base_charge = sub.base_price
            
            # Calculate overages
            overages = Overage.objects.filter(
                subscription=sub,
                start_date__gte=sub.start_date,
                end_date__lte=sub.renewal_date,
                is_paid=False
            )
            
            total_overage = sum([o.calculated_charge for o in overages])
            
            # Create billing record
            Billing.objects.create(
                company=sub.company,
                billing_date=sub.renewal_date,
                base_charge=base_charge,
                overage_charges=total_overage,
                status='pending'
            )
            
            # Update subscription dates
            if sub.billing_cycle == 'monthly':
                sub.start_date = sub.renewal_date
                sub.renewal_date = sub.renewal_date + relativedelta(months=+1)
            else:
                sub.start_date = sub.renewal_date
                sub.renewal_date = sub.renewal_date + relativedelta(years=+1)
            sub.save()

@shared_task
def send_shift_reminder_to_users():
    """ This method will send a reminder to users that have shifts starting in the next 12 hours """
    try:
        # Get shifts starting in next 12 hours that are assigned
        upcoming_shifts = Shift.objects.filter(
            task__start_time__lte=timezone.now() + timedelta(hours=12),
            task__start_time__gte=timezone.now(),
            status='assigned'
        )

        for shift in upcoming_shifts:
            staff_members = shift.staff.all()
            for staff_member in staff_members:
                # Send notification to each staff member
                send_notification(
                    staff_member.user.id,
                    'Upcoming Shift Reminder',
                    f'You have a shift starting at {shift.task.start_time.strftime("%I:%M %p")}',
                    'shift_reminder'
                )
    except Exception as e:
        print(f"Error sending shift reminders: {e}")
        return False

@shared_task 
def check_late_shift_signins():
    """ Check for shifts that should have started but staff haven't signed in """
    try:
        # Get shifts that should have started in last hour but still in assigned status
        current_time = timezone.now()
        late_shifts = Shift.objects.filter(
            task__start_time__lte=current_time,
            task__start_time__gte=current_time - timedelta(minutes=30),
            status='assigned'
        )

        for shift in late_shifts:
            staff_members = shift.staff.all()
            for staff_member in staff_members:
                # Send notification about missed shift start
                send_notification(
                    staff_member.user.id,
                    'Missed Shift Start',
                    f'Your shift was scheduled to start at {shift.task.start_time.strftime("%I:%M %p")}. Please sign in immediately.',
                    'shift_late'
                )

            # Also notify shift creator/supervisor
            if shift.created_by:
                send_notification(
                    shift.created_by.id,
                    'Late Shift Sign-in',
                    f'Staff have not signed in for shift scheduled at {shift.task.start_time.strftime("%I:%M %p")}',
                    'shift_late_supervisor'
                )

    except Exception as e:
        print(f"Error checking late shift sign-ins: {e}")
        return False
