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
from management.models import Overage, Billing

# Initialize Stripe with your secret key
stripe.api_key = settings.STRIPE_SECRET_KEY
    
        
@api_view(["POST"])
@owner_required
def create_payment_sheet(request):
    """Create a payment sheet for Stripe payment processing"""
    try:
        # Get amount from request
        amount = request.data.get('amount', 0)

        # Create a new customer
        customer = stripe.Customer.create()
        
        # Create an ephemeral key for the customer
        ephemeral_key = stripe.EphemeralKey.create(
            customer=customer.id,
            stripe_version='2022-11-15',
        )
        
        # Create a payment intent with the calculated amount
        payment_intent = stripe.PaymentIntent.create(
            amount=amount,  # Amount in cents from the frontend
            currency='gbp',
            customer=customer.id,
            automatic_payment_methods={
                'enabled': True,
            },
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
@permission_classes([IsAuthenticated])
def get_subscription_tiers(request):
    """ Get the subscription tiers from the database """
    try:
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
        return Response({'subscriptionTiers': subscription_tiers_data}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["GET"])
@owner_required
@permission_classes([IsAuthenticated])
def get_current_plan(request):
    """ Get the current plan from the database of the associated company """
    # Get the company object associated with the user
    try:
        company = Company.objects.get(owner=request.user)
        # Get the subscription plan associated with the company
        subscription_plan = SubscriptionPlan.objects.get(company=company)
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
    print('request.data', request.data)
    try:
        # Get required data from request
        plan_id = request.data.get('plan_id')
        billing_period = request.data.get('billing_period')
        try:
            company = Company.objects.get(owner=request.user)
            tier = SubscriptionTier.objects.get(id=plan_id)
        except Company.DoesNotExist as e:
            return Response({'error': f'Error getting company: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except SubscriptionTier.DoesNotExist as e:
            return Response({'error': f'Error getting subscription tier: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        # Get the current timezone to set the start and renewal dates
        start_date = timezone.now().date()
        renewal_date = start_date + timedelta(days=365 if billing_period == 'annually' else 30)
        
        # Update the subscription plan
        subscription_plan, created = SubscriptionPlan.objects.update_or_create(
            company=company,
            defaults={
                'tier': tier,
                'billing_cycle': billing_period,
                'start_date': start_date,
                'renewal_date': renewal_date,
                'is_active': True,
            }
        )
        print('tier', tier)
        print('company', company)
        print('subscription_plan', subscription_plan)

        return Response({'message': 'Subscription updated successfully'}, status=status.HTTP_200_OK)


    except Exception as e:
        return Response(
            {'error': f'Error getting subscription tier: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    


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
        
        # Handle successful payment
        if event['type'] == 'payment_intent.succeeded':
            payment_intent = event['data']['object']
            # You can access payment metadata here if needed
            # metadata = payment_intent.metadata
            
            return Response({'status': 'success'}, status=status.HTTP_200_OK)
            
    except ValueError as e:
        return Response({'error': 'Invalid payload'}, status=status.HTTP_400_BAD_REQUEST)
    except stripe.error.SignatureVerificationError as e:
        return Response({'error': 'Invalid signature'}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


