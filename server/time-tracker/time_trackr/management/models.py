from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, Group, Permission, PermissionsMixin

from django.contrib.auth.hashers import make_password
from django.conf import settings

from staff.models import Staff

from django.db import models
from django.conf import settings
from datetime import date
from django.utils import timezone

from staff.models import TimeSheet

ROLE_PERMISSIONs = {
  'owner': {
    'can_view': ['owner', 'staff', 'admin'],
    'can_edit': ['owner'],
    'can_delete': ['owner'],
    'can_create': ['owner'],
  },
  'employee': {
    'can_view': ['owner', 'staff', 'admin'],
    'can_edit': ['owner', 'staff'],
    'can_delete': ['owner', 'staff'],
    'can_create': ['owner', 'staff'],
  },
  'admin': {
    'can_view': ['owner', 'staff', 'admin'],
    'can_edit': ['owner', 'staff', 'admin'],
    'can_delete': ['owner', 'staff', 'admin'],
    'can_create': ['owner', 'staff', 'admin'],
  }
}




class UserManager(BaseUserManager):
  def create_user(self, email, password, **extra_fields):
    if not email:
      raise ValueError('The Email field must be set')
    
    email = self.normalize_email(email)
    user = self.model(email=email, **extra_fields)
    user.set_password(password)  # Hash the password
    user.save()
    return user
  
  def create_owner(self, email, password, **extra_fields):
    extra_fields.setdefault('is_employee', True)
    extra_fields.setdefault('is_admin', True)
    extra_fields.setdefault('is_active', True)
    extra_fields.setdefault('is_owner', True)
    extra_fields.setdefault('is_staff', True)
    return self.create_user(email, password, **extra_fields)
  
  
  def create_admin(self, email, password, company=None, **extra_fields):
    extra_fields.setdefault('is_employee', True)
    extra_fields.setdefault('is_admin', True)
    extra_fields.setdefault('is_active', True)
    extra_fields.setdefault('is_staff', True)
    
    # First create the user
    user = self.create_user(email, password, **extra_fields)
    
    # If company is provided, create the staff relationship
    if company:
      try:
        Staff.objects.create(user=user, company=company)
      except Exception as e:
        user.delete()
        raise ValueError(f'Error creating admin account: {e}')
        
    return user


  def create_staff(self, email, password, company=None, **extra_fields):
    extra_fields.setdefault('is_employee', True)
    extra_fields.setdefault('is_active', True)
    
    # First create the user
    user = self.create_user(email, password, **extra_fields)
    
    # If company is provided, create the staff relationship
    if company:
      try:
        Staff.objects.create(user=user, company=company)
      except Exception as e:
        user.delete()
        raise ValueError(f'Error creating staff account: {e}')
        
    return user
      

  def create_superuser(self, email, password=None, **extra_fields):
    # Set additional fields for the superuser
    extra_fields.setdefault('is_employee', True)
    extra_fields.setdefault('is_staff', True)
    extra_fields.setdefault('is_admin', True)
    extra_fields.setdefault('is_owner', True)
    extra_fields.setdefault('is_superuser', True)
    extra_fields.setdefault('is_active', True) 

    # Use create_user to actually create the superuser
    return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
  first_name = models.CharField(max_length=30, blank=True)
  last_name = models.CharField(max_length=30, blank=True)
  email = models.EmailField(unique=True)
  phone = models.CharField(max_length=15, blank=True, null=True)
  dob = models.DateField(blank=True, null=True)
  address = models.CharField(max_length=100, blank=True, null=True, default=None)
  postcode = models.CharField(max_length=15, blank=True, null=True, default=None)
  city = models.CharField(max_length=100, blank=True, null=True, default=None)
  country = models.CharField(max_length=100, blank=True, null=True, default=None)
  password = models.CharField(max_length=100)
  is_owner = models.BooleanField(default=False)
  is_staff = models.BooleanField(default=False)
  is_employee = models.BooleanField(default=False)
  is_admin = models.BooleanField(default=False)
  is_superuser = models.BooleanField(default=False)
  is_active = models.BooleanField(default=True)
  allow_push_notification = models.BooleanField(default=False)
  allow_email_notification = models.BooleanField(default=False)
  allow_marketing_emails = models.BooleanField(default=False)
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now_add=True)
  
  def has_perm(self, perm, obj=None):
    return True
  
  def has_module_perms(self, app_label):
    return True
  
  # MEthod is used to get the user's full name
  def get_full_name(self):
    return f'{self.first_name} {self.last_name}'
  
  groups = models.ManyToManyField(
      Group,
      related_name="custom_user_groups",
      blank=True,
      help_text="The groups this user belongs to.",
      verbose_name="groups",
  )
  
  user_permissions = models.ManyToManyField(
      Permission,
      related_name="custom_user_permissions",
      blank=True,
      help_text="Specific permissions for this user.",
      verbose_name="user permissions",
  )
  
 

  objects = UserManager()

  USERNAME_FIELD = 'email'
  REQUIRED_FIELDS = ['first_name', 'last_name']
  
  ## Override the save method to ensure the user is created with the correct permissions
  def save(self, *args, **kwargs):
    super().save(*args, **kwargs)  # Call the parent class's save method
  
  
  
class Identity(models.Model):
  user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_identity')
  id_type = models.CharField(max_length=100)
  id_front = models.ImageField(upload_to='identity', blank=True, null=True, default=None)
  id_back = models.ImageField(upload_to='identity', blank=True, null=True, default=None)
  created_at = models.DateTimeField(auto_now_add=True)


class BillingAddress(models.Model):
  user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_billing_address')
  address = models.CharField(max_length=100, blank=True, null=True, default=None)
  postcode = models.CharField(max_length=15, blank=True, null=True, default=None)
  city = models.CharField(max_length=100, blank=True, null=True, default=None)
  country = models.CharField(max_length=100, blank=True, null=True, default=None)
  created_at = models.DateTimeField(auto_now_add=True)

  def __str__(self):
    return f'{self.user} - {self.address} - {self.postcode} - {self.city} - {self.country}'


class Company(models.Model):
  """ The company model describes a company database model that identifies all the company details
    """
  owner = models.ForeignKey(User, on_delete=models.CASCADE, null=True, related_name='company_owner')
  name = models.CharField(max_length=100)
  registration_number = models.CharField(max_length=100, blank=True, null=True)
  email = models.EmailField()
  services = models.TextField()
  helpline = models.CharField(max_length=15, blank=True, null=True)
  address = models.CharField(max_length=100)
  postcode = models.CharField(max_length=15, blank=True, null=True)
  city = models.CharField(max_length=100, blank=True, null=True)
  country = models.CharField(max_length=100)
  website = models.URLField()
  
  def __str__(self):
    return self.name
  
  
class Client(models.Model):
  company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='client_company')
  name = models.CharField(max_length=100)
  email = models.EmailField(blank=True, null=True)
  phone = models.CharField(max_length=15, null=True, blank=True)
  address = models.CharField(max_length=100, null=True, blank=True)
  postcode = models.CharField(max_length=15, null=True, blank=True)
  city = models.CharField(max_length=100, null=True, blank=True)
  country = models.CharField(max_length=100, null=True, blank=True)
  created_at = models.DateTimeField(auto_now_add=True)
  created_by = models.ForeignKey(User, blank=True, null=True, on_delete=models.SET_NULL, related_name='client_creator')
  
  def __str__(self):
    return self.name
      



class Contracts(models.Model):
  client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='client_contract')
  name = models.CharField(max_length=100)
  address = models.CharField(max_length=100)
  postcode = models.CharField(max_length=15)
  city = models.CharField(max_length=100)
  start_date = models.DateField(blank=True, null=True)
  end_date = models.DateField(blank=True, null=True)
  created_at = models.DateTimeField(auto_now_add=True)
  is_completed = models.BooleanField(default=False)
  created_by = models.ForeignKey(User, blank=True, null=True, on_delete=models.SET_NULL, related_name='contract_creator')
  
  def __str__(self):
    return f'{self.name} - {self.client}'
  
    # Method is used to save the contract after the end date has been updated
  def save(self, *args, **kwargs):
    self.check_completion_status()
    super().save(*args, **kwargs)

  # This method is used to check the end date of the contract and update the is_completed field to True if the end date is in the past
  def check_completion_status(self):
    if self.end_date < date.today():
      self.is_completed = True




class Task(models.Model):
    contract = models.ForeignKey('Contracts', on_delete=models.CASCADE, related_name='task_contract')
    task_serial = models.CharField(max_length=100, default=None)
    name = models.CharField(max_length=100, default=None, blank=True, null=True)
    description = models.TextField()
    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)
    start_time = models.TimeField(blank=True, null=True)
    end_time = models.TimeField(blank=True, null=True)
    amount = models.DecimalField(max_digits=5, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='task_creator')
    selected_by = models.ManyToManyField('staff.Staff', 
        related_name='task_selected_by', 
        blank=True
    )
    status = models.CharField(max_length=20, choices=[('pending', 'Pending'), ('assigned', 'Assigned'), ('selected', 'Selected'), ('completed', 'Completed')], default='pending')
    
    def __str__(self):
        return f'{self.name} - {self.contract} - {self.status}'

    def check_and_update_status(self):
        """Check if task should be marked as completed based on scheduled end date/time"""
        if self.end_date and self.end_time:
            task_end_datetime = timezone.datetime.combine(self.end_date, self.end_time)
            task_end_datetime = timezone.make_aware(task_end_datetime)
            
            if timezone.now() >= task_end_datetime:
                self.status = 'completed'
                self.save()
                
                # Update associated shifts that haven't been ended yet
                incomplete_shifts = self.task_shift.exclude(status='completed')
                for shift in incomplete_shifts:
                    shift.auto_complete()

    def save(self, *args, **kwargs):
        self.check_and_update_status()
        super().save(*args, **kwargs)
        

class Shift(models.Model):
    """ The model defines the shift database and the fields that are required for the shift model."""
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='task_shift')
    staff = models.ManyToManyField('staff.Staff', related_name='shift_staff')
    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)
    start_time = models.TimeField(blank=True, null=True)  # When staff actually started
    end_time = models.TimeField(blank=True, null=True)    # When staff actually ended
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    status = models.CharField(
        max_length=20, 
        choices=[
            ('pending', 'Pending'),
            ('assigned', 'Assigned'), 
            ('started', 'Started'),
            ('completed', 'Completed'), 
            ('cancelled', 'Cancelled')
        ],
        default='pending'
    )
    created_by = models.ForeignKey(User, blank=True, null=True, on_delete=models.SET_NULL, related_name='shift_creator')

    def can_end_shift(self):
        """Check if shift can be ended manually"""
        if self.status != 'started':
            return False
            
        # Can only end shift before task's scheduled end time
        task_end_datetime = timezone.datetime.combine(
            self.start_time,
            self.end_time
        )
        task_end_datetime = timezone.make_aware(task_end_datetime)
        
        return timezone.now() <= task_end_datetime

    def create_timesheets(self):
        """Create timesheet entries for all staff members"""
        for staff_member in self.staff.all():
            TimeSheet.objects.get_or_create(
                shift=self,
                staff=staff_member,
                status='pending'
            )

    def end_shift(self):
        """Manually end a shift if allowed"""
        if not self.can_end_shift():
            raise ValueError("Cannot end shift after scheduled end time")
            
        self.status = 'completed'
        self.end_time = timezone.now().time()
        self.save()
        
        # Create timesheets
        self.create_timesheets()
        
        # Check if all shifts for task are completed
        task_shifts = self.task.task_shift.all()
        if all(shift.status == 'completed' for shift in task_shifts):
            self.task.status = 'pending'
            self.task.save()

    def auto_complete(self):
        """Automatically complete shift when task end time is reached"""
        self.status = 'completed'
        self.end_time = self.task.end_time  # Use task's end time
        self.save()
        self.create_timesheets()
        
        # Add automatic comments for each staff member
        for staff_member in self.staff.all():
            TaskComment.objects.get_or_create(
                shift=self,
                created_by=staff_member.user,
                defaults={'comment': 'Shift was completed successfully'}
            )

    def check_and_update_status(self):
        """Check if shift should be marked as completed based on task end time"""
        if self.status not in ['completed', 'cancelled'] and self.task.end_date and self.task.end_time:
            task_end_datetime = timezone.datetime.combine(
                self.task.end_date,
                self.task.end_time
            )
            task_end_datetime = timezone.make_aware(task_end_datetime)
            
            if timezone.now() >= task_end_datetime:
                self.auto_complete()

    def save(self, *args, **kwargs):
        self.check_and_update_status()
        super().save(*args, **kwargs)




      
class TaskComment(models.Model):
    """ The model defines the task comment database and the fields that are required for the task comment model."""
    comment = models.TextField()
    shift = models.ForeignKey(Shift, on_delete=models.CASCADE)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, blank=True, null=True, related_name='comment_creator')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.task} - {self.comment}'

    def save(self, *args, **kwargs):
        if self.shift.status == 'completed':
            # Check if this staff member has already commented on this shift
            existing_comment = TaskComment.objects.filter(
                shift=self.shift,
                created_by=self.created_by
            ).exists()
            
            if not existing_comment:
                # If no existing comment from this staff member, save the new comment
                if not self.comment:  # If no specific comment provided
                    self.comment = "Shift was completed successfully"
                super().save(*args, **kwargs)
        else:
            # For non-completed shifts, save normally
            super().save(*args, **kwargs)

class ChatRoom(models.Model):
    name = models.CharField(max_length=255)
    participants = models.ManyToManyField(User, related_name='chat_rooms')
    is_private = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['name']

    def __str__(self):
        return self.name

class Message(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE, related_name='messages', default=None)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['timestamp']

    def __str__(self):
        return f'{self.sender.username}: {self.content[:50]}'
  

class SubscriptionPlan(models.Model):
    COMPANY_SIZE_TIERS = [
        (20, '20 employees'),
        (50, '50 employees'),
        (100, '100 employees'),
        (200, '200 employees'),
        (500, '500 employees'),
        (1000, '1000 employees'),
        (0000, 'unlimited employees'),
    ]

    COMPANY_BILLING_CYCLE = [
        ('monthly', 'Monthly'),
        ('annual', 'Annual'),
    ]
    
    company = models.OneToOneField(Company, on_delete=models.CASCADE)
    tier = models.PositiveIntegerField(choices=COMPANY_SIZE_TIERS)
    billing_cycle = models.CharField(max_length=10, choices=COMPANY_BILLING_CYCLE)
    base_price = models.DecimalField(max_digits=10, decimal_places=2)
    overage_rate = models.DecimalField(max_digits=10, decimal_places=2)  # Per employee rate
    start_date = models.DateField()
    renewal_date = models.DateField()
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return f"{self.company.name} - {self.get_tier_display()}"
    


class EmployeeCountHistory(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    date = models.DateField(auto_now_add=True)
    count = models.PositiveIntegerField()
    
    class Meta:
        indexes = [
            models.Index(fields=['company', 'date']),
        ]
    
    def __str__(self):
        return f"{self.company.name} - {self.date}: {self.count} employees"
    
  
# company/models.py
class Overage(models.Model):
    subscription = models.ForeignKey(SubscriptionPlan, on_delete=models.CASCADE)
    start_date = models.DateField()
    end_date = models.DateField()
    extra_employees = models.PositiveIntegerField()
    overage_days = models.PositiveIntegerField()  # Number of days over limit
    calculated_charge = models.DecimalField(max_digits=10, decimal_places=2)
    is_paid = models.BooleanField(default=False)
    
    def calculate_charge(self):
        daily_rate = (self.subscription.overage_rate / 30)  # Monthly proration
        return round(self.extra_employees * daily_rate * self.overage_days, 2)
    
    def save(self, *args, **kwargs):
        if not self.calculated_charge:
            self.calculated_charge = self.calculate_charge()
        super().save(*args, **kwargs)