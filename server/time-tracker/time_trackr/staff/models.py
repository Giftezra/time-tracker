""" The staff model describes a staff members database model.
    The model contains the relevant tables and fields for the staff members."""
from django.db import models
from django.conf import settings

from django.core.management import call_command
from django.contrib.auth.models import BaseUserManager
from django.contrib.auth import get_user_model


class StaffManager(models.Manager):
  ''


class Staff(models.Model):
  user = models.OneToOneField('management.User', on_delete=models.CASCADE, related_name='staff')
  company = models.ForeignKey('management.Company', on_delete=models.SET_NULL, related_name='staff_member', null=True)
  date_hired = models.DateField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now_add=True)
  
  def __str__(self):
    return f'{self.user} - {self.company}'
  
  
  
  
class Availability(models.Model):
  
  staff = models.ForeignKey(Staff, on_delete=models.CASCADE)
  start_date = models.DateField(blank=True, null=True)
  end_date = models.DateField(blank=True, null=True)
  start_time = models.TimeField(blank=True, null=True)
  end_time = models.TimeField(blank=True, null=True)
  updated_at = models.DateTimeField(auto_now=True)
  
  def __str__(self):
    return f'{self.staff} - {self.start_date} - {self.end_time}'