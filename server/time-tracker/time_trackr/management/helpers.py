from management.models import User
from exponent_server_sdk import PushClient
from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut, GeocoderUnavailable
from functools import lru_cache


def send_notification(user_id, title, message, notification_type):
    try:
        push_client = PushClient()
            
        # Get user with the specified ID who has allowed push notifications and has a token
        user = User.objects.filter(
            id=user_id,
            token__isnull=False
        ).first()
        
        if not user or not user.token:
            return False, 'No active notification tokens found for user'
            
        notification = {
            'to': user.token,
            'sound': 'default',
            'title': title,
            'body': message,
            'data': {'type': notification_type}
        }
        
        response = push_client.publish(notification)
        return True, response
            
    except Exception as e:
        return False, str(e)
    

def get_coordinates_from_address(address, postcode, country = 'United Kingdom'):
    """ Convert address, postcode and country to latitude and longitude using
    the geopy library.
    Uses caching to avoid repeated lookups.

    Args:
        address (str): The address of the location.
        postcode (str): The postcode of the location.
        country (str): The country of the location.

    Returns:
        tuple: A tuple containing the latitude and longitude of the location.
    """
    try:
        geolocator = Nominatim(user_agent="time-tracker")
        full_address = f"{address}, {postcode}, {country}"
        location = geolocator.geocode(full_address, timeout=10)

        if location:
            return location.latitude, location.longitude
        else:
            return None, None
    except (GeocoderTimedOut, GeocoderUnavailable) as e:
        return None, None
    
def get_cache_key(prefix, *args):
    """ Generate a cache key for the given arguments. """
    return f"{prefix}:{':'.join(str(arg) for arg in args)}"
    
    
    
