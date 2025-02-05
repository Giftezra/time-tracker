from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, Group, Permission, PermissionsMixin

from django.contrib.auth.hashers import make_password
from django.conf import settings

from staff.models import Staff

from django.db import models
from django.conf import settings
from datetime import date
from django.utils import timezone

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
    contract = models.ForeignKey('Contracts', on_delete=models.CASCADE)
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
    status = models.CharField(max_length=20, choices=[('pending', 'Pending'), ('assigned', 'Assigned'), ('selected', 'Selected'), ('completed', 'Completed')], default='pending')
    
    def __str__(self):
        return f'{self.name} - {self.contract} - {self.status}'

      

class Shift(models.Model):
    """ The model defines the shift database and the fields that are required for the shift model."""
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='task_shift')
    staff = models.ManyToManyField('staff.Staff',related_name='shift_staff')
    start_time = models.DateTimeField(blank=True, null=True)
    end_time = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    status = models.CharField(max_length=20, choices=[('pending', 'Pending'),('assigned', 'Assigned'), ('completed', 'Completed'), ('cancelled', 'Cancelled'), ('started', 'Started')])
    created_by = models.ForeignKey(User, blank=True, null=True, on_delete=models.SET_NULL, related_name='shift_creator')
    def __str__(self):
        return f'{self.task} - {self.staff}'
      

class TaskComment(models.Model):
    """ The model defines the task comment database and the fields that are required for the task comment model."""
    comment = models.TextField()
    task = models.ForeignKey(Task, on_delete=models.CASCADE)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, blank=True, null=True, related_name='comment_creator')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.task} - {self.comment}'

      

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
  

class Subscription(models.Model):
    SUBSCRIPTION_STATUS_CHOICES = [
        ('trial', 'Trial'),
        ('active', 'Active'),
        ('past_due', 'Past Due'),
        ('canceled', 'Canceled'),
    ]

    company = models.OneToOneField(Company, on_delete=models.CASCADE, related_name='subscription')
    status = models.CharField(max_length=20, choices=SUBSCRIPTION_STATUS_CHOICES, default='trial')
    trial_ends_at = models.DateTimeField()
    next_billing_date = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def calculate_amount_due(self):
        """Calculate the amount due for the next billing cycle"""
        # Get all staff members who should be billed
        billable_staff = self.company.staff_members.filter(
            models.Q(date_hired__lte=self.next_billing_date - timezone.timedelta(days=7)) |  # Staff past trial
            models.Q(date_hired__lte=timezone.now() - timezone.timedelta(days=7))  # Staff whose trial just ended
        )
        
        active_staff_count = billable_staff.count()
        return active_staff_count * 5.00  # £5 per employee

    def generate_invoice(self):
        """Generate an invoice for the current billing period"""
        amount = self.calculate_amount_due()
        employee_count = self.company.staff_members.count()
        
        invoice = SubscriptionInvoice.objects.create(
            subscription=self,
            billing_date=self.next_billing_date,
            amount=amount,
            employee_count=employee_count,
            status='pending'
        )
        
        # Update next billing date
        self.next_billing_date = self.next_billing_date + timezone.timedelta(days=30)
        self.save()
        
        return invoice

    def __str__(self):
        return f"{self.company.name} - {self.status}"

class SubscriptionInvoice(models.Model):
    PAYMENT_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('paid', 'Paid'),
        ('failed', 'Failed'),
    ]

    subscription = models.ForeignKey(Subscription, on_delete=models.CASCADE, related_name='invoices')
    billing_date = models.DateTimeField()
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    employee_count = models.IntegerField()
    status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    paid_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.subscription.company.name} - {self.billing_date.strftime('%Y-%m-%d')} - £{self.amount}"
  
