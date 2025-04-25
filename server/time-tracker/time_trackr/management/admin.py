from django.contrib import admin
from .models import User,Client,Company,Contracts,TaskComment,Task,Shift, Message, ChatRoom, Identity,BillingAddress, SubscriptionPlan,Overage, EmployeeCountHistory, Billing, SubscriptionTier, SubscriptionHistory

from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django import forms

# Register your models here.

class UserAdmin(BaseUserAdmin):
    list_display = ('email', 'first_name', 'last_name', 'is_employee', 'is_admin', 'is_owner')
    list_filter = ('is_employee', 'is_admin', 'is_owner', )
    search_fields = ('email', 'first_name', 'last_name')
    ordering = ('email',)

    # Fields to show in the edit/add form
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ('first_name', 'last_name', 'phone', 'dob', 'address', 'city', 'postcode', 'country')}),
        ('Permissions', {'fields': ('is_employee', 'is_admin', 'is_owner', 'is_superuser')}),
        ('Notifications', {'fields': ('allow_push_notification', 'allow_email_notification', 'allow_marketing_emails')}),
        ('Important Dates', {'fields': ('last_login', 'created_at')}),
    )

    # Fields for creating a new user
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2', 'first_name', 'last_name', 'is_employee', 'is_admin', 'is_owner'),
        }),
    )

    readonly_fields = ('last_login', 'created_at')


class SubscriptionTierAdminForm(forms.ModelForm):
    # Convert the JSON field to a textarea with one feature per line
    features = forms.CharField(
        widget=forms.Textarea(attrs={'rows': 6}),
        help_text='Enter one feature per line',
        required=False
    )

    class Meta:
        model = SubscriptionTier
        fields = '__all__'

    def clean_features(self):
        # Convert textarea lines to list for JSON storage
        features_text = self.cleaned_data['features']
        # Split by newline and remove empty lines
        features_list = [f.strip() for f in features_text.split('\n') if f.strip()]
        return features_list

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Convert list to newline-separated string for display
        if isinstance(self.instance.features, list):
            self.initial['features'] = '\n'.join(self.instance.features)


class SubscriptionTierAdmin(admin.ModelAdmin):
    form = SubscriptionTierAdminForm
    list_display = ('name', 'description', 'features', 'numberOfEmployees', 'rate', 'overage_rate')

class ContractAdmin(admin.ModelAdmin):
    list_display = ('name', 'client', 'is_completed')
    list_filter = ('client', 'client__company')
    search_fields = ('name', 'client__name')


# Company Management
class CompanyAdmin(admin.ModelAdmin):
    list_display = ('name', 'owner', 'registration_number', 'email')
    search_fields = ('name',)
    list_filter = ('name',)

class ClientAdmin(admin.ModelAdmin):
    list_display = ('name', 'company', 'email', 'created_at')
    list_filter = ('company',)
    search_fields = ('name', 'company__name', 'email')

# Task Management
class TaskAdmin(admin.ModelAdmin):
    list_display = ('name', 'contract', 'status', 'is_completed')
    list_filter = ('status', 'contract__client__company')
    search_fields = ('name', 'contract__name')

class ShiftAdmin(admin.ModelAdmin):
    list_display = ('task', 'start_date', 'end_date', 'status')
    list_filter = ('status', 'task__contract__client__company', 'staff__user__first_name', 'staff__user__last_name')
    search_fields = ('task__name',)

# Subscription and Billing
class SubscriptionPlanAdmin(admin.ModelAdmin):
    list_display = ('company', 'tier', 'start_date', 'renewal_date', 'is_active')
    list_filter = ('tier', 'is_active')
    search_fields = ('company__name',)

class SubscriptionHistoryAdmin(admin.ModelAdmin):
    list_display = ('subscription', 'start_date', 'renewal_date')
    list_filter = ('subscription__company',)
    search_fields = ('subscription__company__name',)

class OverageAdmin(admin.ModelAdmin):
    list_display = ('company', 'date', 'overage_days', 'extra_employees', 'calculated_charge', 'is_paid')
    list_filter = ('company',)
    search_fields = ('company__name',)

class TaskCommentAdmin(admin.ModelAdmin):
    list_display = ('shift', 'comment', 'created_by', 'created_at')
    list_filter = ('shift__task__name', 'shift__task__contract__client__company')
    search_fields = ('shift__task__name', 'created_by__user__first_name', 'created_by__user__last_name')

# Register models with custom admin classes
admin.site.register(User, UserAdmin)
admin.site.register(Company, CompanyAdmin)
admin.site.register(Client, ClientAdmin)
admin.site.register(Task, TaskAdmin)
admin.site.register(Shift, ShiftAdmin)
admin.site.register(SubscriptionPlan, SubscriptionPlanAdmin)

# Register remaining models with default admin
admin.site.register(Contracts, ContractAdmin)
admin.site.register(TaskComment, TaskCommentAdmin)
admin.site.register(Message)
admin.site.register(ChatRoom)
admin.site.register(Identity)
admin.site.register(Overage)
admin.site.register(Billing)
admin.site.register(EmployeeCountHistory)
admin.site.register(BillingAddress)
admin.site.register(SubscriptionTier, SubscriptionTierAdmin)
admin.site.register(SubscriptionHistory, SubscriptionHistoryAdmin)
