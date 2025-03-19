from django.urls import path, include
from .view.main.event import get_shift_by_date, decline_shift, accept_shift, get_shift_details, get_calendar_shifts
from .view.main.task_manager import start_shift, end_shift,apply_task, get_all_task_dates, get_task_details, get_available_tasks, get_current_day_shifts

from .view.main.timesheet import get_timesheet_data, get_ongoing_shift
from .view.main.dashboard import get_active_shift_data, get_completed_shifts

from .view.main.availability import create_availablity, update_availability, get_marked_availabilities

urlpatterns = [
  path('get/shift/details/', get_shift_details, name='get_shift_details'),
  path('get/shifts/by/date/', get_shift_by_date, name='get_shift_by_date'),
  path('get/task/dates/', get_all_task_dates, name='get_all_task_dates'),
  path('get/available/tasks/', get_available_tasks, name='get_available_tasks'),
  path('get/task/details/', get_task_details, name='get_task_details'),
  path('get/current/day/shifts/', get_current_day_shifts, name='get_current_day_shifts'),
  path('get/calendar/shifts/', get_calendar_shifts, name='get_calendar_shifts'),

  path('get/marked/availabilities/', get_marked_availabilities, name='get_marked_availabilities'), 
  path('get/timesheet/data/', get_timesheet_data, name='get_timesheet_data'),
  path('get/current/ongoing/shift/', get_active_shift_data, name='get_active_shift_data'),
  path('get/ongoing/shift/', get_ongoing_shift, name='get_ongoing_shift'),
  path('get/completed/shifts/', get_completed_shifts, name='get_completed_shifts'),
  
  
  path('create/availability/', create_availablity, name='create_availablity'),
  
  path('update/availability/', update_availability, name='update_availability'),
  
  path('accept/shift/', accept_shift, name='accept_shift'),
  path('decline/shift/', decline_shift, name='decline_shift'),
  path('begin/shift/', start_shift, name='start_shift'),
  path('terminate/current/shift/', end_shift, name='end_shift'),
  
  path('apply/task/', apply_task, name='select_shift'),  
]
