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
    'process-subscriptions-daily': {
        'task': 'management.tasks.process_subscriptions',
        'schedule': crontab(hour=0, minute=0),  # Run at midnight every day
    },
    'check-trial-periods-daily': {
        'task': 'management.tasks.check_trial_periods',
        'schedule': crontab(hour=9, minute=0),  # Run at 9 AM every day
    },
    # Add other scheduled tasks here
}

# Auto-discover tasks from all installed apps
app.autodiscover_tasks()

@app.task(bind=True)
def debug_task(self):
    print(f'Request: {self.request!r}')