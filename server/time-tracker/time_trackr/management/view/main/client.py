""" Clientview module is designed to handle the client page of the client.
The methods will return all clients and their details, create a new client,
update a client, delete a client, and search for a client.

The methods will also create contracts (site) for the clients
"""

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
 
from .decorators import owner_required, staff_required, admin_required, superuser_required
from django.core.exceptions import ValidationError
from ...models import Company, Client, Contracts, Shift
from staff.models import Staff
from ...tasks import send_contract_created_email, send_client_created_email, send_contract_updated_email


from ...serializer import ContractsSerializer, ClientSerializer
from datetime import datetime
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
@admin_required
def create_client(request):
   try:      
    # First get the valid company if the user is the owner of the company
    company = None
    # Set the company to the owner company if the user is the owner of the company
    # Set the company to the staff company if the user is a staff member
    if request.user.is_owner:
        company = get_object_or_404(Company, owner=request.user)
    elif request.user.is_employee:
        company = get_object_or_404(Staff, user=request.user).company
    else:
        return Response({"error": "User is not authorized to create a client"}, status=status.HTTP_403_FORBIDDEN)
    
    # Get the email address of the owner of the company
    owner_email = company.owner.email

    # Validate the fields
    fields = ['name', 'email', 'phone', 'address', 'postcode', 'city']
    data = {}
    # Loop through the fields and validate the data is not empty, then add it to the data dictionary
    for field in fields:
        value = request.data.get(field)
        if not value:
            return Response({"error": f"{field} is required"}, status=status.HTTP_400_BAD_REQUEST)
        data[field] = value
    
    # Create a new client with request data
    # Return a success message if the client is created successfully
    # Return an error message if the client is not created successfu
    client = Client.objects.create(
      company=company,
      name=data['name'],
      email=data['email'],
      phone=data['phone'],
      address=data['address'],
      postcode=data['postcode'],
      city=data['city'],
      created_by=request.user
    )
    # Send an email to the owner with the client details
    send_client_created_email.delay(client.name, client.phone, client.email, client.services, owner_email)

    # Return a success message if the client is created successfully
    return Response({"message": "Client created successfully"}, status=status.HTTP_201_CREATED)

   except ValidationError as e:
    return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


""" Create a new contract for the client"""
@api_view(['POST'])
@permission_classes([IsAuthenticated])
@admin_required
def create_contract(request):
    """Method is used to create a new contract for the client. After the contract is created, 
    an email is sent to the company owner with the contract details"""
    if not request.data:
        return Response({"error": "Contract details are required"}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        client = Client.objects.get(id=request.data.get('client_id'))
        employee = get_object_or_404(Staff, user=request.user)
        company = employee.company
        owner = company.owner
        
        # Validate required fields
        fields = ['name', 'description', 'address', 'postcode', 'city', 'start_date', 'end_date']
        data = {}
        for field in fields:
            value = request.data.get(field)
            if not value:
                return Response({"error": f"{field} is required"}, status=status.HTTP_400_BAD_REQUEST)
            data[field] = value
            
        # Validate dates to ensure that the dates is in the correct format and that the end date is not before the start date
        try:
            start_date = datetime.strptime(data['start_date'], '%Y-%m-%d').date()
            end_date = datetime.strptime(data['end_date'], '%Y-%m-%d').date()
            if end_date < start_date:
                return Response({"error": "End date cannot be before start date"}, 
                              status=status.HTTP_400_BAD_REQUEST)
        except ValueError:
            return Response({"error": "Invalid date format. Use YYYY-MM-DD"}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        # Create contract
        contract = Contracts.objects.create(
            client=client,
            name=data['name'],
            description=data['description'],
            address=data['address'],
            postcode=data['postcode'],
            city=data['city'],
            start_date=start_date,
            end_date=end_date,
            created_by=request.user
        )
        # Send an email to the company owner with the contract details
        send_contract_created_email.delay(client.name, contract.name, start_date, end_date, owner.email)
        return Response({"message": "Contract created successfully"}, 
                      status=status.HTTP_201_CREATED)
        
    except Client.DoesNotExist:
        return Response({"error": "Client does not exist"}, 
                      status=status.HTTP_400_BAD_REQUEST)
    except ValidationError as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
  
  

  

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@admin_required
def getContractsAndJobDetails(request):
    print("request", request);
    """Retrieve active contract and job details for a specific client including assigned staff."""
    try:
        # Filter all client associated with the company
        if request.user.is_owner:
            company = get_object_or_404(Company, owner=request.user)
        elif request.user.is_employee:
            company = get_object_or_404(Staff, user=request.user).company
        else:
            return Response({"error": "User is not authorized to get clients"}, status=status.HTTP_403_FORBIDDEN)
        print("company", company);
        

        client = get_object_or_404(Client, company=company)
        # Optimize the query using select_related and prefetch_related
        # Filter for only active contracts (is_completed=False)
        contracts = Contracts.objects.filter(
            client=client,
            is_completed=False  # Only get active contracts
        ).prefetch_related(
            'task_set__task_shift__staff'
        )
        
        client_contract_details = []
        
        for contract in contracts:
            for task in contract.task_set.all():
                # Get all staff members from prefetched shifts
                staff_members = set()
                for shift in task.task_shift.all():
                    staff_members.update(shift.staff.all())
                
                staff_list = [{
                    'staff_id': staff.id,
                    'staff_name': staff.user.get_full_name(),
                    'staff_email': staff.user.email,
                    'staff_phone': staff.phone,
                } for staff in staff_members]
                
                client_contract_details.append({
                    'client_name': client.name,
                    'contract_id': contract.id,
                    'contract_name': contract.name,
                    'contract_address': contract.address,
                    'contract_postcode': contract.postcode,
                    'contract_city': contract.city,

                    'employees': staff_list,
                    'task_details': {
                        'task_id': task.id,
                        'task_name': task.name,
                        'task_status': task.status,
                        'start_date': task.start_date,
                        'end_date': task.end_date,
                        'start_time': task.start_time,
                        'end_time': task.end_time
                    }
                })
        
        # Return a message if there are no active contracts for the client
        if not client_contract_details:
            return Response({
                'message': 'No active contracts found for this client',
                'client_contract_details': []
            }, status=status.HTTP_200_OK)
        print("client_contract_details", client_contract_details);
            
        # Return the response with the contract details
        return Response({
            'client_contract_details': client_contract_details
        }, status=status.HTTP_200_OK)
        
    # Return an error message if the client does not exist

    except Client.DoesNotExist:
        return Response({
            "error": "Client does not exist"
        }, status=status.HTTP_404_NOT_FOUND)
    
    # Return an error message if an error occurs
    except Exception as e:
        return Response({
            "error": f"An error occurred: {str(e)}"
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)




@api_view(['GET'])
@permission_classes([IsAuthenticated])
@admin_required
def getClientAndContracts(request):
    """
    Retrieve clients and their associated contracts for a company based on the request user.
    Args:
        request (HttpRequest): The HTTP request object containing user information.
    Returns:
        Response: A JSON response containing client details and their associated contracts,
                or an error message if the client does not exist.
    """    
    try:
        # Check if the user is the owner of the company and retrieve the company object
        try:
            if request.user.is_owner:
                company = get_object_or_404(Company, owner=request.user)
            elif request.user.is_employee:
                company = get_object_or_404(Staff, user=request.user).company
            else:
                return Response({"error": "User is not authorized to get clients"}, status=status.HTTP_403_FORBIDDEN)
        except Company.DoesNotExist:
            return Response({"error": "Company does not exist"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Get all clients associated with the company
        clients = Client.objects.filter(company=company)
        client_list = [] # Create an empty list to store the client details

        for client in clients:
            # Get all the contracts associated with the client
            contracts = Contracts.objects.filter(client=client)
            contract_list = [] # Create an empty list to store the contract details

            for contract in contracts:
                contract_list.append({
                    'contract_id': contract.pk,
                    'name': contract.name,
                    'address': contract.address,
                    'postcode': contract.postcode,
                    'city': contract.city,
                    'start_date': contract.start_date,
                    'end_date': contract.end_date,
                })
            # Append the client and contract details to the client_list
            # This would return all the clients and their associated contracts
            client_list.append({
                'client_id': client.pk,
                'name': client.name,
                'address': client.address,
                'postcode': client.postcode,
                'email': client.email,
                'phone': client.phone,
                'city': client.city,
                'country': client.country,
                'contracts': contract_list
            })
            print("client_list", client_list)
        
        # Return the response with the client details and their associated contracts
        return Response({'client_details': client_list}, status=status.HTTP_200_OK)
    
    # Return an error message if the client does not exist
    except Client.DoesNotExist:
        return Response({"error": "Client does not exist"}, status=status.HTTP_400_BAD_REQUEST)
    except Contracts.DoesNotExist:
        return Response({"error": "Contracts does not exist"}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"error": f"An error occurred: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
    



@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
@admin_required
def update_contract(request):
    """ Method is used to update the start and end date of the contract """
    # Validate the request data
    if not request.data:
        return Response({"error": "Contract details are required"}, status=status.HTTP_400_BAD_REQUEST)
    
    # Get the contract id and the end date from the request data
    contract_id = request.data.get('contract_id')
    end_date = request.data.get('end_date')

    try:
        contract = get_object_or_404(Contracts, id=contract_id)
        
        # Get the company associated with the contract through the client
        company = contract.client.company
        
        # Get owner's email
        owner_email = company.owner.email
        
        # Get all admin staff emails for the company
        admin_staff = Staff.objects.filter(
            company=company,
            user__is_admin=True,  # Check user's is_admin flag
            user__is_active=True
        )
        admin_emails = [staff.user.email for staff in admin_staff]
        
        # Add owner's email to the list
        recipient_emails = list(set([owner_email] + admin_emails))  # Using set to remove any duplicates
        
        # Update the contract
        old_end_date = contract.end_date
        contract.end_date = end_date
        contract.save()
        
        # Send email notification about the contract update
        send_contract_updated_email.delay(
            contract.name,
            contract.client.name,
            str(old_end_date),
            str(end_date),
            recipient_emails
        )
        # Return a success message if the contract is updated successfully
        return Response({"message": "Contract updated successfully"}, status=status.HTTP_200_OK)
    except Contracts.DoesNotExist:
        return Response({"error": "Contract does not exist"}, status=status.HTTP_400_BAD_REQUEST)
  
  
  
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
@admin_required
def complete_contract(request):
    """ The method is used to end the contract between parties automatically when the end date arrives.
    The method updates the contract's status to completed."""
    if not request.data:
        return Response({"error": "Contract details are required"}, status=status.HTTP_400_BAD_REQUEST)
    
    contract_id = request.data.get('contract_id')
    
    try:
        contract = get_object_or_404(Contracts, id=contract_id)
        contract.is_completed = True
        contract.save()
        return Response({"message": "Contract completed successfully"}, status=status.HTTP_200_OK)
    except Contracts.DoesNotExist:
        return Response({"error": "Contract does not exist"}, status=status.HTTP_404_NOT_FOUND) 
  