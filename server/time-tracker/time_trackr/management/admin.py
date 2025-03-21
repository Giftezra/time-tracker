from django.contrib import admin
from .models import User,Client,Company,Contracts,TaskComment,Task,Shift, Message, ChatRoom, Identity,BillingAddress, SubscriptionPlan,Overage, EmployeeCountHistory, Billing, SubscriptionTier

from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django import forms

# Register your models here.

class UserAdmin(BaseUserAdmin):
    list_display = ('email', 'first_name', 'last_name', 'is_employee', 'is_admin', 'is_owner', 'is_active')
    list_filter = ('is_employee', 'is_admin', 'is_owner', )
    search_fields = ('email', 'first_name', 'last_name')
    ordering = ('email',)

    # Fields to show in the edit/add form
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ('first_name', 'last_name', 'phone', 'dob', 'address', 'city', 'postcode', 'country')}),
        ('Permissions', {'fields': ('is_active', 'is_employee', 'is_admin', 'is_owner', 'is_superuser')}),
        ('Notifications', {'fields': ('allow_push_notification', 'allow_email_notification', 'allow_marketing_emails')}),
        ('Important Dates', {'fields': ('last_login', 'created_at')}),
    )

    # Fields for creating a new user
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2', 'first_name', 'last_name', 'is_employee', 'is_admin', 'is_owner', 'is_active'),
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


admin.site.register(User, UserAdmin)
admin.site.register(Client)
admin.site.register(Company)
admin.site.register(Contracts)
admin.site.register(TaskComment)
admin.site.register(Task)
admin.site.register(Shift)
admin.site.register(Message)
admin.site.register(ChatRoom)
admin.site.register(Identity)
admin.site.register(SubscriptionPlan)
admin.site.register(Overage)
admin.site.register(Billing)
admin.site.register(EmployeeCountHistory)
admin.site.register(BillingAddress)
admin.site.register(SubscriptionTier, SubscriptionTierAdmin)
