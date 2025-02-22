from .models import User, Client, Company, Contracts, Identity, TaskComment, Task, Shift, Message, ChatRoom
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.exceptions import ValidationError


class UserSerializer(serializers.ModelSerializer):
  """ The user serializer is a model serializer that serializes the user model"""
  class Meta:
    model = User
    fields = ['id', 'email', 'first_name', 'last_name', 'password']
    extra_kwargs = {'password': {'write_only': True}}

  def validate(self, data):
    # Instead of replacing the data, just return the original data
    return data

  def create(self, validated_data):
    # Handle password hashing when creating a new user
    password = validated_data.pop('password', None)
    user = super().create(validated_data)
    if password:
      user.set_password(password)
      user.save()
    return user


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
  def validate(self, attrs):
      try:
          data = super().validate(attrs)
      except ValidationError as e:
          print(f"Validation Error: {e.detail}")
          raise e

      user = self.user
      print("user", user);

      # Check if the user is a staff member and has a Staff profile
      company = None
      date_hired = None
      if hasattr(user, 'staff'):
        staff_profile = user.staff
        company = staff_profile.company
        date_hired = staff_profile.date_hired

      # Add user and staff/company details to the response
      data['user'] = {
          'id': user.id,
          'email': user.email,
          'first_name': user.first_name,
          'last_name': user.last_name,
          'phone': user.phone,
          'dob': user.dob,
          'address': user.address,
          'postcode': user.postcode,
          'city': user.city,
          'country': user.country,
          'company_name': company.name if company else '',
          'company_services': company.services if company else '',
          'company_address': company.address if company else '',
          'company_postcode': company.postcode if company else '',
          'company_helpline': company.helpline if company else '',
          'company_website': company.website if company else '',
          'company_email': company.email if company else '',
          'is_owner': user.is_owner,
          'is_admin': user.is_admin,
          'is_employee': user.is_employee,
          'is_superuser': user.is_superuser,
          'date_hired': date_hired,
          'is_active': user.is_active,
          'allow_push_notification': user.allow_push_notification,
          'allow_email_notification': user.allow_email_notification,
          'allow_marketing_emails': user.allow_marketing_emails,
      }
      return data

  
class ClientSerializer(serializers.ModelSerializer):
  class Meta:
    model = Client
    fields = '__all__'
    
class IdentitySerializer(serializers.ModelSerializer):
  class Meta:
    model = Identity
    fields = '__all__'

    
class CompanySerializer(serializers.ModelSerializer):
  class Meta:
    model = Company
    fields = '__all__'


class ContractsSerializer(serializers.ModelSerializer):
  class Meta:
    model = Contracts
    fields = '__all__'


class TaskCommentSerializer(serializers.ModelSerializer):
  class Meta:
    model = TaskComment
    fields = '__all__'


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'


class ShiftSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shift
        fields = '__all__'
        
        
class ChatRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatRoom
        fields = '__all__'
        

class MessageSerializer(serializers.ModelSerializer):
  class Meta:
    model = Message
    fields = '__all__'
  