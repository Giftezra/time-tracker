import os
from celery import Celery
from celery.schedules import crontab

# Set the default Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'time_trackr.settings')

# Create the Celery app
app = Celery('time_trackr')

# Using a string here means the worker doesn't have to serialize
# the configuration object to child processes.
app.config_from_object('django.conf:settings', namespace='CELERY')

# Configure the Celery beat schedule
app.conf.beat_schedule = {
    'generate_bills': {
        'task': 'management.tasks.generate_bills',
        'schedule': crontab(hour=6, minute=0),
    },
    'calculate_overage': {
        'task': 'management.tasks.calculate_overage',
        'schedule': crontab(hour=12, minute=0),
    },
    'send-shift-reminders': {
        'task': 'management.tasks.send_shift_reminder_to_users',
        'schedule': 3600.0,  # Run every hour
    },
    'check-late-signins': {
        'task': 'management.tasks.check_late_shift_signins',
        'schedule': 900.0,  # Run every 15 minutes
    },
}

# Auto-discover tasks from all installed apps
app.autodiscover_tasks()

@app.task(bind=True)
def debug_task(self):
    print(f'Request: {self.request!r}')