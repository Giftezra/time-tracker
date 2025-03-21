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

# Initialize Stripe with your secret key
stripe.api_key = settings.STRIPE_SECRET_KEY
    
        
@api_view(["POST"])
@owner_required
def create_payment_sheet(request):
    """Create a payment sheet for Stripe payment processing"""
    try:
        # Create a new customer
        customer = stripe.Customer.create()
        
        # Create an ephemeral key for the customer
        ephemeral_key = stripe.EphemeralKey.create(
            customer=customer.id,
            stripe_version='2022-11-15',
        )
        
        # Create a payment intent
        payment_intent = stripe.PaymentIntent.create(
            amount=1099,  # Amount in cents
            currency='eur',
            customer=customer.id,
            automatic_payment_methods={
                'enabled': True,
            },
        )
        
        return Response({
            'paymentIntent': payment_intent.client_secret,
            'ephemeralKey': ephemeral_key.secret,
            'customer': customer.id,
            'publishableKey': settings.STRIPE_PUBLISHABLE_KEY
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
        })
    return Response({'subscriptionTiers': subscription_tiers_data}, status=status.HTTP_200_OK)


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
        # Get the tier details from the subscription tier model
        # Get the billing cycle from the subscription plan model
        # Get the start date of the subscription plan and the number of employees the tier allows
        user_plan = {
            'id': subscription_plan.id,
            'name': subscription_plan.tier.name,
            'billing_cycle': subscription_plan.billing_cycle,
            'active_employees': active_employees,
            'tier_limit': subscription_plan.tier.numberOfEmployees,
            'overage_rate': subscription_plan.tier.overage_rate,
            'start_date': subscription_plan.start_date,
            'renewal_date': subscription_plan.renewal_date,
            'is_active': subscription_plan.is_active,
        }
        return Response({'user_plan': user_plan}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


