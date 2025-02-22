from celery import shared_task
from django.core.mail import send_mail, EmailMultiAlternatives, EmailMessage
from django.template.loader import render_to_string
from django.conf import settings



@shared_task
def send_shift_cancellation_email(created_by_email, staff_name, client_name, shift_date, shift_time):
    """ Method will send an email to the staff member with the onboarding details which will include the app store and play store urls
    to enable them to download the app and login to the app """
    context = {
        'staff_name': staff_name,
        'client_name': client_name,
        'shift_date': shift_date,
        'shift_time': shift_time
    }
    html_message = render_to_string('emails/cancel_shift.html', context)
    plain_message = 'Your shift has been cancelled.'
    send_mail(
        subject='Shift Cancellation',
        message=plain_message,
        html_message=html_message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[created_by_email],
        fail_silently=False
    )
