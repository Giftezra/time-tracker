from django.contrib import admin
from .models import Staff, Availability, Leave, TimeSheet   

# Register your models here.


class StaffAdmin(admin.ModelAdmin):
    list_display = ('user', 'company', 'date_hired')
    list_filter = ('company',)
    search_fields = ('user__email', 'user__first_name', 'user__last_name')

    def save_model(self, request, obj, form, change):
        # Automatically log the creation/update of staff
        print(f'Staff created/updated: {obj}')
        super().save_model(request, obj, form, change)
    
admin.site.register(Staff, StaffAdmin)
admin.site.register(Availability)
admin.site.register(Leave)
admin.site.register(TimeSheet)
