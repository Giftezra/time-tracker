from functools import wraps
from rest_framework.response import Response
from rest_framework import status

# Decorator for Owner Validation
def owner_required(view_func):
    @wraps(view_func)
    def _wrapped_view_func(request, *args, **kwargs):
        if not hasattr(request.user, 'is_owner') or not request.user.is_owner:
            return Response(
                {"detail": "Access denied: You are not the owner."},
                status=status.HTTP_403_FORBIDDEN
            )
        return view_func(request, *args, **kwargs)
    return _wrapped_view_func
  
  

# Decorator for Staff Validation
def staff_required(view_func):
    @wraps(view_func)
    def _wrapped_view_func(request, *args, **kwargs):
        if not request.user.is_authenticated or not request.user.is_staff:
            return Response(
                {"detail": "Access denied: Staff access required."},
                status=status.HTTP_403_FORBIDDEN
            )
        return view_func(request, *args, **kwargs)
    return _wrapped_view_func
  
  
  

# Decorator for Admin Validation
def admin_required(view_func):
    @wraps(view_func)
    def _wrapped_view_func(request, *args, **kwargs):
        if not request.user.is_authenticated or not hasattr(request.user, 'is_admin') or not request.user.is_admin:
            return Response(
                {"detail": "Access denied: Admin access required."},
                status=status.HTTP_403_FORBIDDEN
            )
        return view_func(request, *args, **kwargs)
    return _wrapped_view_func
  
  
  

# Decorator for Superuser Validation
def superuser_required(view_func):
    @wraps(view_func)
    def _wrapped_view_func(request, *args, **kwargs):
        if not request.user.is_authenticated or not request.user.is_superuser:
            return Response(
                {"detail": "Access denied: Superuser access required."},
                status=status.HTTP_403_FORBIDDEN
            )
        return view_func(request, *args, **kwargs)
    return _wrapped_view_func
