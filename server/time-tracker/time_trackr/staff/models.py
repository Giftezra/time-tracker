""" The staff model describes a staff members database model.
    The model contains the relevant tables and fields for the staff members."""
from django.db import models
from django.conf import settings
from django.utils import timezone
from django.core.management import call_command
from django.contrib.auth.models import BaseUserManager
from django.contrib.auth import get_user_model


class Staff(models.Model):
  user = models.OneToOneField('management.User', on_delete=models.CASCADE, related_name='staff')
  company = models.ForeignKey('management.Company', on_delete=models.SET_NULL, related_name='staff_members', null=True)
  date_hired = models.DateField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)
  is_active = models.BooleanField(default=True)
  
  def __str__(self):
    return f'{self.user} - {self.company}'
  
  def save(self, *args, **kwargs):
    is_new = self.pk is None
    
    if is_new:
      self.trial_end_date = timezone.now().date() + timezone.timedelta(days=7)
      
    super().save(*args, **kwargs)
    
    if is_new and self.company:
      from management.models import Subscription
      
      subscription, created = Subscription.objects.get_or_create(
        company=self.company,
        defaults={
          'status': 'trial',
          'trial_ends_at': timezone.now() + timezone.timedelta(days=7),
          'next_billing_date': timezone.now() + timezone.timedelta(days=7)
        }
      )
  
  
  
  
class Availability(models.Model):
  staff = models.ForeignKey(Staff, on_delete=models.CASCADE, related_name='staff_availability')
  start_date = models.DateField(blank=True, null=True)
  end_date = models.DateField(blank=True, null=True)
  start_time = models.TimeField(blank=True, null=True)
  end_time = models.TimeField(blank=True, null=True)
  note = models.TextField(blank=True, null=True)
  updated_at = models.DateTimeField(auto_now_add=True)
  availability_status = models.CharField(max_length=20, choices=[('available', 'Available'), ('unavailable', 'Unavailable')], default='available')
  
  def __str__(self):
    return f'{self.staff} - {self.start_date} - {self.end_time}'
  
  def save(self, *args, **kwargs):
    if self.availability_status == 'available':
      self.start_date = None
      self.end_date = None
      self.start_time = None
      self.end_time = None
      
    super().save(*args, **kwargs)

class Leave(models.Model):
    LEAVE_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('on_leave', 'On Leave'),
        ('available', 'Available'),
    ]
    
    staff = models.ForeignKey(Staff, on_delete=models.CASCADE, related_name='staff_leave')
    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)
    start_time = models.TimeField(blank=True, null=True)
    end_time = models.TimeField(blank=True, null=True)
    reason = models.TextField(blank=True, null=True)
    status = models.CharField(
        max_length=100,
        choices=LEAVE_STATUS_CHOICES,
        default='available',
        blank=True,
        null=True
    )
    updated_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.staff} - {self.start_date} - {self.end_time}'
    
    def save(self, *args, **kwargs):
        if self.status == 'available':
            self.start_date = None
            self.end_date = None
            self.start_time = None
            self.end_time = None 

        super().save(*args, **kwargs)
  
class TimeSheet(models.Model):
   shift = models.ForeignKey('management.Shift', on_delete=models.CASCADE, related_name='shift_time_sheet')
   staff = models.ForeignKey(Staff, on_delete=models.CASCADE, related_name='staff_time_sheet')
   status = models.CharField(max_length=20, choices=[('pending', 'Pending'), ('approved', 'Approved')])
   created_at = models.DateTimeField(auto_now_add=True)
   updated_at = models.DateTimeField(auto_now=True)

   def __str__(self):
      return f'{self.shift} - {self.staff} - {self.status}'

