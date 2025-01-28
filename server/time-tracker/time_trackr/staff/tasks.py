from celery import shared_task
from django.core.mail import send_mail, EmailMultiAlternatives, EmailMessage
from django.template.loader import render_to_string



@shared_task
def send_registration_email(email):
    pass
