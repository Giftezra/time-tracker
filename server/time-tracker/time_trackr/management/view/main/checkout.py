from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from management.models import Company
from .decorators import owner_required
from management.models import User
import stripe
from django.conf import settings

# Initialize Stripe with your secret key
stripe.api_key = settings.STRIPE_SECRET_KEY

@api_view(["GET"])
@owner_required
def get_owner_address(request):
    """This method is used to get the owner's address from the database using the request user object"""
    try:
        user = request.user
        address_data = {
            "address": user.address,
            "postcode": user.postcode,
            "city": user.city,
            "country": user.country
        }
        return Response({"address": address_data}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
        
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
def get_publishable_key(request):
    """Get the publishable key for Stripe payment processing"""
    return Response({"publishableKey": settings.STRIPE_PUBLISHABLE_KEY}, status=status.HTTP_200_OK)
        
        


