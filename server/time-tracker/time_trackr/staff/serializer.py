from .models import Availability, Staff, TimeSheet
from rest_framework import serializers


class StaffSerializer(serializers.ModelSerializer):
  class Meta:
    model = Staff
    fields = '__all__'
    
    

class AvailabilitySerializer(serializers.ModelSerializer):
  class Meta:
    model = Availability
    fields = '__all__'


class TimeSheetSerializer(serializers.ModelSerializer):
  class Meta:
    model = TimeSheet
    fields = '__all__'


