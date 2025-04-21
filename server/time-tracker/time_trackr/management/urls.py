from django.urls import path
from .view.account.authentication import register_owner, lookup_address
from .view.main.dashboard import update_company, delete_company, get_task_statistics, get_top_performers, get_today_events, get_contract_statistics,  get_employees_on_leave, get_today_events
from .view.main.profile import create_company, update_user_preferences, update_owner_company_details
from .view.main.employees import employee_display, get_shift_details, get_employee_with_id, get_employee_task_details, get_employee_work_log, onboard_employee, remove_employee
from .view.main.client import create_client, create_contract, getContractsAndJobDetails, getClientAndContracts, update_contract, complete_contract, delete_contract, update_client, delete_client
from .view.main.task_manager import get_active_tasks, get_clients_shifts, create_shift, create_task, assign_task, terminate_shift, approve_task, get_all_contracts, get_all_open_task, start_shift, update_task, get_available_employees, delete_task
from .view.main.calender import get_shifts, email_shift_report, cancel_shift, update_shift, approve_shift, get_all_employees
from .view.main.payment import create_payment_sheet, get_subscription_tiers, get_current_plan, update_subscription_plan, get_subscription_history
from .view.main.notification import NotificationTokenView, NotificationView
from .view.account.login import CustomTokenObtainPairView
from rest_framework_simplejwt.views import (
    TokenRefreshView
)
from .view.main.messages import (
    DirectMessageConsumer, 
    get_chat_rooms,
    get_chat_history
)

urlpatterns = [
    # PAth definitions for all reqistration requests on the management app
    path('register/owner/', register_owner, name='register_owner'),
    path('onboard/employee/', onboard_employee, name='register_staff'),
    
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    path('cancel/shift/', cancel_shift, name='cancel_shift'),
    path('create/company/', create_company, name='create_company'),
    path('create/client/', create_client, name='create_client'),
    path('create/contract/', create_contract, name='create_contract'),
    path('create/shift/', create_shift, name='create_shift'),
    path('create/task/', create_task, name='create_task'),
    path('approve/task/', approve_task, name='approve_task'),
    path('approve/shift/', approve_shift, name='approve_shift'),
    path('assign/task/', assign_task, name='assign_task'),
    path('complete/contract/', complete_contract, name='complete_contract'),
    path('delete/company/', delete_company, name='delete_company'),
    path('delete/contract/', delete_contract, name='delete_contract'),
    path('delete/task/', delete_task, name='delete_task'),
    path('delete/client/', delete_client, name='delete_client'),
    path('email/shift/report/', email_shift_report, name='email_shift_report'),
    path('get/shifts/', get_shifts, name='get_shifts'),
    path('get/all/contracts/', get_all_contracts, name='get_all_contracts'),
    path('get/contract/shifts/details/', getContractsAndJobDetails, name='get_contract'),
    path('get/all/employees/', get_all_employees, name='get_all_employees'),
    path('get/client/contracts/', getClientAndContracts, name='get_contract'),
    path('get/employee/display/', employee_display, name='get_all_employees'),
    path('get/employee/shift/', get_shift_details, name='get_shift_details'),
    path('get/available/employees/', get_available_employees, name='get_available_employees'),
    path('get/employees/on/leave/', get_employees_on_leave, name='get_employees_on_leave'),
    path('get/today/events/', get_today_events, name='get_today_events'),
    path('get/active/tasks/', get_active_tasks, name='get_active_tasks'),
    path('get/assigned/shifts/', get_clients_shifts, name='get_assigned_or_ongoing_shifts'),
    path('get/open/tasks/', get_all_open_task, name='get_all_open_task'),
    path('get/employee/with/id/', get_employee_with_id, name='get_employee_with_id'),
    path('get/employee/task/details/', get_employee_task_details, name='get_employee_task_details'),
    path('get/employee/work/log/', get_employee_work_log, name='get_employee_work_log'),
    path('get/subscription/history/', get_subscription_history, name='get_subscription_history'),
    path('get/subscription/tiers/', get_subscription_tiers, name='get_subscription_tiers'),
    path('get/current/plan/', get_current_plan, name='get_current_plan'),
    # The path definitions for the dashboard
    path('get/today/events/', get_today_events, name='get_today_events'),
    path('get/contract/statistics/', get_contract_statistics, name='get_contract_statistics'),
    path('create/payment/sheet/', create_payment_sheet, name='create_payment_sheet'),
    path('lookup/address/', lookup_address, name='lookup_address'),
    path('remove/employee/', remove_employee, name='remove_employee'),
    path('start/shift/', start_shift, name='start_shift'),
    path('terminate/shift/', terminate_shift, name='terminate_shift'),
    path('update/company/', update_company, name='update_company'),
    path('update/contract/', update_contract, name='update_contract'),
    path('update/user/preferences/', update_user_preferences, name='update_user_preferences'),
    path('update/owner/company/details/', update_owner_company_details, name='update_owner_company_details'),
    path('update/task/', update_task, name='update_task'),
    path('update/shift/', update_shift, name='update_shift'),
    path('update/client/', update_client, name='update_client'),
    path('update/subscription/plan/', update_subscription_plan, name='update_subscription_plan'),   
    path('notifications/token/', NotificationTokenView.as_view(), name='notification-token'),
    path('notifications/send/', NotificationView.as_view(), name='send-notification'),
    

    path('get/task/statistics/', get_task_statistics, name='get_task_statistics'),
    path('get/top/performers/', get_top_performers, name='get_top_performers'),

    # Chat related endpoints
    path('chat-rooms/', get_chat_rooms, name='get_chat_rooms'),
    path('chat-history/', get_chat_history, name='get_chat_history'),
]
