""" This file contains the tasks that will be handled by celery when the management app is run. 
These methods will all be run in the background and will not return anything. """

from celery import shared_task
from django.core.mail import send_mail, EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings
from django.utils import timezone
from .models import Subscription


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
def process_subscriptions():
    """
    Celery task to process subscriptions and generate invoices.
    This task should be scheduled to run daily.
    """
    # Get all active subscriptions due for billing
    subscriptions = Subscription.objects.filter(
        next_billing_date__lte=timezone.now(),
        status__in=['trial', 'active']
    )

    results = []
    for subscription in subscriptions:
        try:
            # Generate invoice for the subscription
            invoice = subscription.generate_invoice()
            
            # Update subscription status if trial is ending
            if subscription.status == 'trial' and subscription.trial_ends_at <= timezone.now():
                subscription.status = 'active'
                subscription.save()
                
            results.append({
                'company': subscription.company.name,
                'invoice_id': invoice.id,
                'amount': invoice.amount,
                'status': 'success'
            })
            
        except Exception as e:
            results.append({
                'company': subscription.company.name,
                'error': str(e),
                'status': 'failed'
            })
    
    return results


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


@shared_task
def check_trial_periods():
    """
    Celery task to check trial periods and notify companies before expiration.
    This task should be scheduled to run daily.
    """
    # Find subscriptions where trial is ending in 2 days
    trial_ending_soon = Subscription.objects.filter(
        status='trial',
        trial_ends_at__lte=timezone.now() + timezone.timedelta(days=2),
        trial_ends_at__gt=timezone.now()
    )

    for subscription in trial_ending_soon:
        try:
            days_left = (subscription.trial_ends_at - timezone.now()).days
            
            # Send email notification to company owner
            send_trial_ending_email.delay(
                company_name=subscription.company.name,
                days_left=days_left,
                owner_email=subscription.company.owner.email
            )
            
        except Exception as e:
            print(f"Failed to process trial notification for {subscription.company.name}: {str(e)}")




