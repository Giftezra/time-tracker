from django.contrib import admin
from .models import Staff, Availability, Leave, TimeSheet   

# Register your models here.


class StaffAdmin(admin.ModelAdmin):
    list_display = ('user', 'company', 'date_hired', 'is_active')
    list_filter = ('company', 'is_active')
    search_fields = ('user__email', 'user__first_name', 'user__last_name')

    def save_model(self, request, obj, form, change):
        # Automatically log the creation/update of staff
        print(f'Staff created/updated: {obj}')
        super().save_model(request, obj, form, change)
    
class TimeSheetAdmin(admin.ModelAdmin):
    list_display = ('staff', 'shift', 'status', 'created_at')
    list_filter = ('staff__company', 'status')
    search_fields = ('staff__user__email',)

class LeaveAdmin(admin.ModelAdmin):
    list_display = ('staff', 'start_date', 'end_date', 'status')
    list_filter = ('staff__company', 'status')
    search_fields = ('staff__user__email',)


class AvailabilityAdmin(admin.ModelAdmin):
    list_display = ('staff', 'start_date', 'end_date', 'availability_status')
    list_filter = ('staff__company', 'availability_status')
    search_fields = ('staff__user__name',)

admin.site.register(Staff, StaffAdmin)
admin.site.register(TimeSheet, TimeSheetAdmin)
admin.site.register(Leave, LeaveAdmin)
admin.site.register(Availability, AvailabilityAdmin)
