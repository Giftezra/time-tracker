from .models import Availability, Staff
from rest_framework import serializers


class StaffSerializer(serializers.ModelSerializer):
  class Meta:
    model = Staff
    fields = '__all__'
    
    

class AvailabilitySerializer(serializers.ModelSerializer):
  class Meta:
    model = Availability
    fields = '__all__'


