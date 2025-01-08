from django.contrib import admin
from .models import User,Client,Company,Contracts,TaskComment,Task,Shift, Message, Conversation, ConversationParticipant, Identity

from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

# Register your models here.

class UserAdmin(BaseUserAdmin):
    list_display = ('email', 'first_name', 'last_name', 'is_staff', 'is_admin', 'is_owner', 'is_active')
    list_filter = ('is_staff', 'is_owner', 'is_active')
    search_fields = ('email', 'first_name', 'last_name')
    ordering = ('email',)

    # Fields to show in the edit/add form
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ('first_name', 'last_name', 'phone', 'dob', 'address', 'city', 'postcode', 'country')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_admin', 'is_owner', 'is_superuser')}),
        ('Notifications', {'fields': ('allow_push_notification', 'allow_email_notification', 'allow_marketing_emails')}),
        ('Important Dates', {'fields': ('last_login', 'created_at')}),
    )

    # Fields for creating a new user
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2', 'first_name', 'last_name', 'is_staff', 'is_owner', 'is_active'),
        }),
    )

    readonly_fields = ('last_login', 'created_at')


admin.site.register(User, UserAdmin)
admin.site.register(Client)
admin.site.register(Company)
admin.site.register(Contracts)
admin.site.register(TaskComment)
admin.site.register(Task)
admin.site.register(Shift)
admin.site.register(Message)
admin.site.register(Conversation)
admin.site.register(ConversationParticipant)
admin.site.register(Identity)

