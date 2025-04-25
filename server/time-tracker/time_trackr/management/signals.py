from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Shift, TimeSheet, Contract, Client, Message, ChatRoom
from management.tasks import send_contract_created_email, send_client_created_email

@receiver(post_save, sender=Shift)
def create_timesheets(sender, instance, created, **kwargs):
    if not created and instance.status == 'completed':
        for staff_member in instance.staff.all():
            TimeSheet.objects.create(
                shift=instance,
                staff=staff_member,
                defaults={
                    'status': 'pending'
                }
            )

# @receiver(post_save, sender=Contract)
# def send_contract_created_notification(sender, instance, created, **kwargs):
#     """ Send an email notification to the company owner when a new contract is created. 
#      ensure they have these notifications enabled first before calling the functions """
#     if created:
#         owner = instance.client.company.owner
#         # Ensure the owner has notifications enabled
#         if owner.allow_email_notification:
#             send_contract_created_email.delay(instance.client.name, instance.name, instance.start_date, instance.end_date, owner.email)


# @receiver(post_save, sender=Client)
# def send_client_created_notification(sender, instance, created, **kwargs):
#     """ Send an email notification to the company owner when a new client is created. 
#      ensure they have these notifications enabled first before calling the functions """
#     if created:
#         owner = instance.company.owner
#         # Ensure the owner has notifications enabled
#         if owner.allow_email_notification:
#             send_client_created_email.delay(instance.name, instance.phone, instance.email, instance.services, owner.email)
#         # TODO: Send a push notification to the owner if they have notifications enabled


# @receiver(post_delete, sender=ChatRoom)
# def delete_message(sender, instance, **kwargs):
#     """ Check if the user has notification enabled and send a push notification to the user """
#     if instance.sender.allow_push_notification:
#         send_push_notification.delay(instance.sender.id, instance.content)

