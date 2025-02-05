from django.urls import path, include
from .view.account.authentication import register_owner, onboard_employee

from .view.main.dashboard import update_company, delete_company
from .view.main.profile import create_company
from .view.main.employees import get_available_employees, get_all_employees, get_shift_details

from .view.main.client import create_client, create_contract, getContractsAndJobDetails, getClientAndContracts, update_contract, complete_contract

from .view.main.task_manager import get_active_shifts, get_clients_shifts, create_shift, create_task,assign_task,terminate_shift,approve_task, get_all_contracts, get_all_unassigned_task

from .view.main.dashboard import get_today_events, get_contract_statistics
from .view.main.checkout import get_owner_address, get_publishable_key, create_payment_sheet

from .view.main.calender import get_shifts

from .view.account.login import CustomTokenObtainPairView

from rest_framework_simplejwt.views import (
    TokenRefreshView, TokenObtainPairView
)

urlpatterns = [
    # PAth definitions for all reqistration requests on the management app
    path('register/user/', register_owner, name='register_owner'),
    path('onboard/employee/', onboard_employee, name='register_staff'),
    
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    path('create/company/', create_company, name='create_company'),
    path('create/client/', create_client, name='create_client'),
    path('create/contract/', create_contract, name='create_contract'),
    path('create/shift/', create_shift, name='create_shift'),
    path('create/task/', create_task, name='create_task'),
    
    path('approve/task/', approve_task, name='approve_task'),
    path('assign/task/', assign_task, name='assign_task'),
    path('terminate/shift/', terminate_shift, name='terminate_shift'),
    
    
    path('update/company/', update_company, name='update_company'),
    path('update/contract/', update_contract, name='update_contract'),
    
    path('complete/contract/', complete_contract, name='complete_contract'),
    
    
    path('delete/company/', delete_company, name='delete_company'),
    
    
    path('get/shifts/', get_shifts, name='get_shifts'),
    path('get/all/contracts/', get_all_contracts, name='get_all_contracts'),
    path('get/contract/shifts/details/', getContractsAndJobDetails, name='get_contract'),
    path('get/client/contracts/', getClientAndContracts, name='get_contract'),
    path('get/employees/', get_all_employees, name='get_all_employees'),
    path('get/employee/shift/', get_shift_details, name='get_shift_details'),
    path('get/available/employees/', get_available_employees, name='get_available_employees'),
    path('get/active/shifts/', get_active_shifts, name='get_active_shifts'),
    path('get/assigned/shifts/', get_clients_shifts, name='get_assigned_or_ongoing_shifts'),
    path('get/unassigned/tasks/', get_all_unassigned_task, name='get_all_unassigned_task'),

    # The path definitions for the dashboard
    path('get/today/events/', get_today_events, name='get_today_events'),
    path('get/contract/statistics/', get_contract_statistics, name='get_contract_statistics'),

    # The path definitions for the checkout
    path('get/owner/address/', get_owner_address, name='get_owner_address'),
    path('get/publishable/key/', get_publishable_key, name='get_publishable_key'),
    path('create/payment/sheet/', create_payment_sheet, name='create_payment_sheet'),
    

]
