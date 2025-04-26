from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from management.models import Company
from management.models import SubscriptionTier
from .decorators import owner_required
from management.models import User
import stripe
from django.conf import settings
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes
from management.models import SubscriptionPlan
from staff.models import Staff
from django.views.decorators.csrf import csrf_exempt
import json
from datetime import datetime, timedelta, timezone
from management.models import Overage, Billing, SubscriptionHistory
from django_ratelimit.decorators import ratelimit
from django.core.cache import cache
from django.conf import settings
from management.helpers import get_cache_key

# Initialize Stripe with your secret key
stripe.api_key = settings.STRIPE_SECRET_KEY
    
        
@api_view(["POST"])
@owner_required
@ratelimit(key='user', rate='100/h', block=True, method=['POST'])
def create_payment_sheet(request):
    """Create a payment sheet for Stripe payment processing"""
    try:
        # Get amount from request
        amount = request.data.get('amount', 0)
        # Retrive the metadata from the request and the subsequent data
        metadata = request.data.get('metadata', {})
        plan_id = metadata.get('plan_id', None)
        billing_period = metadata.get('billing_period', None)

        # Get the company object associated with the user
        company = Company.objects.get(owner=request.user)
        customer = stripe.Customer.create()
        # Create a payment intent with the calculated amount
        payment_intent = stripe.PaymentIntent.create(
            amount=amount,  # Amount in cents from the frontend
            currency='gbp',
            customer=customer.id,
            automatic_payment_methods={
                'enabled': True,
            },
            metadata={
                'company_id': company.id,
                'plan_id': plan_id,
                'billing_period': billing_period,
                'user_id': request.user.id,
            }
        )
        ephemeral_key = stripe.EphemeralKey.create(
            customer=customer.id,
            stripe_version='2022-11-15',
        )
        return Response({
            'paymentIntent': payment_intent.client_secret,
            'ephemeralKey': ephemeral_key.secret,
            'customer': customer.id,
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    

@api_view(["GET"])
@owner_required
@ratelimit(key='user', rate='20/h', block=True, method=['GET'])
@permission_classes([IsAuthenticated])
def get_subscription_tiers(request):
    """ Get the subscription tiers from the database """
    try:
        # Get the cache key and check if the data is already cached
        cache_key = get_cache_key(request.user, 'subscription_tiers')
        cached_data = cache.get(cache_key)
        if cached_data:
            return Response({'subscriptionTiers': cached_data}, status=status.HTTP_200_OK)

        subscription_tiers = SubscriptionTier.objects.all()
        subscription_tiers_data = []
        for tier in subscription_tiers:
            subscription_tiers_data.append({
                'id': tier.id,
                'name': tier.name,
                'description': tier.description,
                'features': tier.features,
                'numberOfEmployees': tier.numberOfEmployees,
                'rate': tier.rate,
                'isPopular': tier.is_popular,
                'overage_rate': tier.overage_rate,
                'is_custom': tier.is_custom,
                'minimum_employees': tier.minimum_employees,
            })
        # Cache the data for 1 hour
        cache.set(cache_key, subscription_tiers_data, 3600)
        return Response({'subscriptionTiers': subscription_tiers_data}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["GET"])
@owner_required
@permission_classes([IsAuthenticated])
@ratelimit(key='user', rate='20/h', block=True, method=['GET'])
def get_current_plan(request):
    """ Get the current plan from the database of the associated company """
    # Get the company object associated with the user
    try:
        company = Company.objects.get(owner=request.user)
        # Get the subscription plan associated with the company
        subscription_plan = SubscriptionPlan.objects.filter(company=company, is_active=True).first()
        # Get all employees that are currently active in the company
        # Count the number of active employees
        active_employees = Staff.objects.filter(company=company, is_active=True).count()
        
        # Calculate overage count
        plan_limit = subscription_plan.tier.numberOfEmployees
        overage_count = max(0, active_employees - plan_limit)

        subscription_plan_data = {
            'plan_name': subscription_plan.tier.name,
            'billing_cycle': subscription_plan.billing_cycle,
            'current_employees': active_employees,
            'plan_limit': plan_limit,
            'overage_count': overage_count,
            'overage_fees': subscription_plan.tier.overage_rate,
            'start_date': subscription_plan.start_date,
            'renewal_date': subscription_plan.renewal_date,
            'status': subscription_plan.is_active,
        }
        return Response({'subscription_plan': subscription_plan_data}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["POST"])
@owner_required
@permission_classes([IsAuthenticated])
def update_subscription_plan(request):
    """Update the subscription plan for a company"""
    try:
        # Get required data from request
        tier_id = request.data.get('tier_id')
        billing_period = request.data.get('billing_period')

        try:
            company = Company.objects.get(owner=request.user)
            tier = SubscriptionTier.objects.get(id=tier_id)
        except Company.DoesNotExist:
            return Response({'error': 'Company not found'}, status=status.HTTP_404_NOT_FOUND)
        except SubscriptionTier.DoesNotExist:
            return Response({'error': 'Subscription tier not found'}, status=status.HTTP_404_NOT_FOUND)
        
        # Get current datetime for start and renewal dates
        start_date = datetime.now(timezone.utc).date()
        renewal_date = start_date + timedelta(days=365 if billing_period == 'annually' else 30)
        
        # Deactivate any existing active plan
        SubscriptionPlan.objects.filter(company=company, is_active=True).update(is_active=False)
        
        # Create new subscription plan
        new_plan = SubscriptionPlan.objects.create(
            company=company,
            tier=tier,
            billing_cycle=billing_period,
            start_date=start_date,
            renewal_date=renewal_date,
            is_active=True,
        )
        
        # Create new subscription history record linked to the new plan
        SubscriptionHistory.objects.create(
            subscription=new_plan,
            start_date=start_date,
            renewal_date=renewal_date,
            is_active=True
        )

        return Response({'message': 'Subscription updated successfully'}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response(
            {'error': f'Error updating subscription plan: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    


@api_view(["GET"])
@owner_required
@permission_classes([IsAuthenticated])
def get_subscription_history(request):
    """ Get the subscription history from the database """
    try:
        # Get the associated company
        company = Company.objects.get(owner=request.user)
        
        # Get subscription history ordered by start date (newest first)
        subscription_history = SubscriptionHistory.objects.filter(
            subscription__company=company
        ).select_related('subscription', 'subscription__tier').order_by('-start_date')
        
        subscription_history_data = []
        for history in subscription_history:
            # Skip if subscription or tier is None
            if not history.subscription or not history.subscription.tier:
                continue
                
            # Determine status
            now = timezone.now().date()
            if history.subscription.is_active:
                history_status = 'active'
            elif history.renewal_date < now:
                history_status = 'expired'
            else:
                history_status = 'active'  # This case shouldn't happen but added for safety

            subscription_history_data.append({
                'id': history.id,
                'start_date': history.start_date,
                'renewal_date': history.renewal_date,
                'tier': history.subscription.tier.name,
                'tier_id': history.subscription.tier.id,
                'billing_cycle': history.subscription.billing_cycle,
                'status': history_status,
                'is_active': history.is_active,
            })
            
        return Response({'subscription_history': subscription_history_data}, status=status.HTTP_200_OK)
        
    except Company.DoesNotExist:
        return Response({'error': 'Company not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

@csrf_exempt
@api_view(["POST"])
def stripe_webhook(request):
    """Handle Stripe webhook events"""
    payload = request.body
    sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
    
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
        )
        
        if event['type'] == 'payment_intent.succeeded':
            payment_intent = event['data']['object']
            metadata = payment_intent.metadata
            
            try:
                company = Company.objects.get(id=metadata.get('company_id'))
                tier = SubscriptionTier.objects.get(id=metadata.get('plan_id'))
                billing_period = metadata.get('billing_period')
                
                # Calculate dates
                start_date = timezone.now().date()
                renewal_date = start_date + timedelta(
                    days=365 if billing_period == 'annually' else 30
                )
                
                # Deactivate existing active plan
                SubscriptionPlan.objects.filter(company=company, is_active=True).update(is_active=False)
                
                # Create new subscription plan
                new_plan = SubscriptionPlan.objects.create(
                    company=company,
                    tier=tier,
                    billing_cycle=billing_period,
                    start_date=start_date,
                    renewal_date=renewal_date,
                    is_active=True,
                )
                    
                # Create history record
                SubscriptionHistory.objects.create(
                    subscription=new_plan,
                    start_date=start_date,
                    renewal_date=renewal_date,
                    is_active=True
                )
                
                return Response({'status': 'subscription updated'}, status=200)
                
            except Exception as e:
                print(f"Error processing webhook: {str(e)}")
                return Response({'error': str(e)}, status=200)
                
        return Response({'status': 'event processed'}, status=200)
        
    except ValueError as e:
        return Response({'error': 'Invalid payload'}, status=400)
    except stripe.error.SignatureVerificationError as e:
        return Response({'error': 'Invalid signature'}, status=400)
    except Exception as e:
        return Response({'error': str(e)}, status=500)