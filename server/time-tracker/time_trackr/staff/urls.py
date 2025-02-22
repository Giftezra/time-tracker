from django.urls import path, include
from .view.main.event import get_shift_in_12, get_all_assigned_shifts, get_shift_by_date, cancel_shift, accept_shift, get_shift_details, just_get
from .view.main.task_manager import start_shift, end_shift,select_task

from .view.main.timesheet import get_all_completed_shifts

from .view.main.availability import create_availablity, get_all_availabilities, update_availability

urlpatterns = [
  path('get/upcoming/shifts/', get_shift_in_12, name='get_shift_in_12'),
  path('get/assigned/shifts/', get_all_assigned_shifts, name='get_all_assigned_shifts'),
  path('get/shift/details/', get_shift_details, name='get_shift_details'),
  path('get/shifts/by/date/', get_shift_by_date, name='get_shift_by_date'),
  path('get/availabilities/', get_all_availabilities, name='get_all_availabilities'),  path('get/completed/shifts/', get_all_completed_shifts, name='get_all_completed_shifts'),
  path('just/get/', just_get, name='just_get'),
  
  
  path('create/availability/', create_availablity, name='create_availablity'),
  
  path('update/availability/', update_availability, name='update_availability'),
  
  path('accept/shift/', accept_shift, name='accept_shift'),
  path('cancel/shift/', cancel_shift, name='cancel_shift'),
  path('start/shift/', start_shift, name='start_shift'),
  path('end/shift/', end_shift, name='end_shift'),
  
  path('select/shift/', select_task, name='select_shift'),  
]
