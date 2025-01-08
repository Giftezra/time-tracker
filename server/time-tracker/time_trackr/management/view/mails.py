""" File create functions used to send mails to users.

The mails use the mail libraries and templates to style the mail content
"""
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags

from django.template import loader

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from django.http import HttpResponse


@api_view(['GET'])
@permission_classes([AllowAny])
def mails(request):
  data = {
    'first_name': 'John Doe',
    'last_name': 'Sunday',
    'amount': 1000,
  }
  template = render_to_string('my_first.html', data )
  return HttpResponse(template, content_type='text/html')