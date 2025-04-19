from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .decorators import admin_required
from django.core.exceptions import ValidationError
from ...models import Company, Client, Contracts, Shift
from staff.models import Staff
from ...tasks import send_contract_created_email, send_client_created_email, send_contract_updated_email
from ...serializer import ContractsSerializer, ClientSerializer
from datetime import datetime
from django_ratelimit.decorators import ratelimit
from django.core.cache import cache
from django.conf import settings
from management.helpers import get_cache_key

    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
@admin_required
@ratelimit(key='user', rate='10/m', method=['POST'])
def create_client(request):
    """
    Create a new client for a company.
    
    Args:
        request: HTTP request containing client details in request.data['new_client']
                Required fields: name, email, phone, address, postcode, city, country
                
    Returns:
        Response with:
        - 201: Client created successfully
        - 400: Validation error
        - 403: User not authorized
        
    Notes:
        - Only company owners and employees can create clients
        - All fields are required and validated
        - Client is associated with the user's company
    """
    try:
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
        # Retrieve the new client details from the request data
        new_client = request.data.get('new_client')

        # Validate the fields

        # Loop through the fields and validate the data is not empty, then add it to the data dictionary
        for field in new_client:
            value = new_client.get(field)
            if not value:
                return Response({"error": f"{field} is required"}, status=status.HTTP_400_BAD_REQUEST)

        # Create a new client with request data
        # Return a success message if the client is created successfully
        # Return an error message if the client is not created successfu
        client = Client.objects.create(
          company=company,
          name=new_client['name'],
          email=new_client['email'],
          phone=new_client['phone'],
          address=new_client['address'],
          postcode=new_client['postcode'],
          city=new_client['city'],
          country=new_client['country'],
          created_by=request.user
        )
        client.save()
        # Send an email to the owner with the client details
        # send_client_created_email.delay(client.name, client.phone, client.email, client.services, owner_email)
        # Return a success message if the client is created successfully
        return Response({"message": "Client created successfully"}, status=status.HTTP_201_CREATED)

    except ValidationError as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


""" Create a new contract for the client"""
@api_view(['POST'])
@permission_classes([IsAuthenticated])
@admin_required
@ratelimit(key='user', rate='10/m', method=['POST'])
def create_contract(request):
    """
    Create a new contract for an existing client.
    
    Args:
        request: HTTP request containing:
            - client_id: ID of the client
            - new_contract: Contract details including:
                - name: Contract name
                - address: Contract location address  
                - postcode: Contract location postcode
                - city: Contract location city
                - start_date: Contract start date (YYYY-MM-DD)
                - end_date: Contract end date (YYYY-MM-DD)
    
    Returns:
        Response with:
        - 201: Contract created successfully
        - 400: Invalid/missing data or client not found
        
    Notes:
        - Validates all required fields
        - Dates must be in YYYY-MM-DD format
        - Client must exist in database
    """
    if not request.data:
        return Response({"error": "Contract details are required"}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Get the data from the request
        # Modified this section to handle both nested and non-nested data formats
        client_id = request.data.get('client_id')
        new_contract = request.data.get('new_contract')
        # Validate the data and return and error if the data is not valid
        # Validate the client id and return and error if the data is not valid
        if not client_id:
            return Response({"error": "Client ID is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        for field in new_contract:
            if not new_contract[field]:
                return Response({"error": f"{field} is required"}, status=status.HTTP_400_BAD_REQUEST)
            
        print("New contract", new_contract)
            
        # Retrieve the client object from the database using the client id
        client = Client.objects.get(id=client_id)
        # Create a new contract object using the new contract data
        # The new contract data is a dictionary of the contract details
        # The contract details are nested in the new contract dictionary
        # Save the contract object to the database
        contract = Contracts.objects.create(
            client=client,
            name=new_contract['name'],
            address=new_contract['address'],
            postcode=new_contract['postcode'],
            city=new_contract['city'],
            start_date=datetime.strptime(new_contract['start_date'], '%Y-%m-%d').date(),
            end_date=datetime.strptime(new_contract['end_date'], '%Y-%m-%d').date(),
            created_by=request.user
        )
        contract.save()
        # Send email notification
        # send_contract_created_email.delay(client.name, contract.name, start_date, end_date, owner.email)
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
@ratelimit(key='user', rate='10/m', method=['GET'])
def getContractsAndJobDetails(request):
    """
    Get active contracts and job details for all clients of a company, including assigned staff.
    
    Returns:
        Response with:
        - 200: List of client jobs containing:
            - Client details (id, name)
            - Task details (serial, times, pay)
            - Contract details (name, address)
            - Assigned staff details (id, name, contact info)
        - 400: Error occurred
        - 403: User not authorized
        
    Notes:
        - Only accessible by company owners and employees
        - Returns shifts filtered by task->contract->client relationship
        - Includes full employee details for each shift
    """
    try:
        # Get the appropriate company based on user role
        if request.user.is_owner:
            company = get_object_or_404(Company, owner=request.user)
        elif request.user.is_employee:
            staff = get_object_or_404(Staff, user=request.user)
            company = staff.company
        else:
            return Response({"error": "User is not authorized to get clients"}, 
                          status=status.HTTP_403_FORBIDDEN)
    except Company.DoesNotExist:
        return Response({"error": "Company does not exist"}, status=status.HTTP_400_BAD_REQUEST)
    
    # Get the cache key for the company
    # Get the cached contracts and job details for the company if it exists
    cache_key = get_cache_key('contracts_and_job_details', company.id)
    cached_data = cache.get(cache_key)
    if cached_data:
        return Response({'client_job_list': cached_data}, status=status.HTTP_200_OK)
    
    try:
        # Get all associated clients with the company
        clients = Client.objects.filter(company=company)
        client_job_list = []
        # Check for the shifts associated with the task__contract__client
        # inside the loop for each client
        for client in clients:
            shifts = Shift.objects.filter(task__contract__client=client)
            for shift in shifts:
                # Get the task details associated with the shift
                # Get all staff members associated with the shift
                staffs = shift.staff.all()
                # Get the employee details for each staff member
                employee_details = []
                for staff in staffs:
                    employee_details.append({
                        'id': staff.id,
                        'name': staff.user.get_full_name(),
                        'email': staff.user.email,
                        'phone': staff.user.phone
                    })
                # Get the client details
                client_job_list.append({
                    'client_id': client.id,
                    'client_name': client.name,
                    'task_serial': shift.task.task_serial,
                    'task_start_time': shift.task.start_time,
                    'task_end_time': shift.task.end_time,
                    'task_start_date': shift.start_date,
                    'pay': shift.task.amount,
                    'contract_name': shift.task.contract.name,
                    'contract_address': shift.task.contract.address,
                    'contract_postcode': shift.task.contract.postcode,
                    'employee': employee_details
                })
        # Cache the data for 5 minutes
        cache.set(cache_key, client_job_list, settings.CACHE_TIMEOUT)
        return Response({'client_job_list': client_job_list}, status=status.HTTP_200_OK)
    except Exception as e:
        print(e)
        return Response({"error": f"An error occurred: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)




@api_view(['GET'])
@permission_classes([IsAuthenticated])
@admin_required
def getClientAndContracts(request):
    """
    Get all clients and their associated contracts for a company.
    
    Returns:
        Response with:
        - 200: List of clients containing:
            - Client details (id, name, contact info)
            - List of associated contracts with details
        - 400: Error occurred
        - 403: User not authorized
        
    Notes:
        - Only accessible by company owners and employees
        - Returns all clients associated with the user's company
        - Includes full contract details for each client
    """    
    try:
        # Check if the user is the owner of the company and retrieve the company object
        try:
            if request.user.is_owner:
                company = get_object_or_404(Company, owner=request.user)
            elif request.user.is_employee:
                staff = get_object_or_404(Staff, user=request.user)
                company = staff.company
            else:
                return Response({"error": "User is not authorized to get clients"}, status=status.HTTP_403_FORBIDDEN)
        except Company.DoesNotExist:
            return Response({"error": "Company does not exist"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Get the cache key for the company
        # Get the cached clients and contracts for the company if it exists
        cache_key = get_cache_key('clients_and_contracts', company.id)
        cached_data = cache.get(cache_key)
        if cached_data:
            return Response({'client_details': cached_data}, status=status.HTTP_200_OK)
        

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
        # Cache the data for 5 minutes
        cache.set(cache_key, client_list, settings.CACHE_TIMEOUT)
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
def update_client(request):
    """
    Update an existing client's details.
    
    Args:
        request: HTTP request containing:
            client: Dictionary with:
                - client_id: ID of client to update
                - Optional fields to update: name, address, postcode, 
                  city, email, phone, country
    
    Returns:
        Response with:
        - 200: Client updated successfully
        - 400: Client not found or invalid data
        
    Notes:
        - Only updates provided fields
        - Client must exist in database
    """
    if not request.data:
        return Response({"error": "Client details are required"}, status=status.HTTP_400_BAD_REQUEST)
    
    # Retrieve the client details from the request data given the client object
    # Fetch the client object from the database using the client id
    # Update the client details if the client object is found and if the details are provided
    client = request.data.get('client')
    client_id = client.get('client_id')
    name = client.get('name')
    address = client.get('address')
    postcode = client.get('postcode')
    city = client.get('city')
    email = client.get('email')
    phone = client.get('phone')
    country = client.get('country')
    
    try:
        client = get_object_or_404(Client, id=client_id)
        if name:
            client.name = name
        if address:
            client.address = address
        if postcode:
            client.postcode = postcode
        if city:
            client.city = city
        if email:
            client.email = email
        if phone:
            client.phone = phone
        if country:
            client.country = country
        client.save()
        return Response({"message": "Client updated successfully"}, status=status.HTTP_200_OK)
    except Client.DoesNotExist:
        return Response({"error": "Client does not exist"}, status=status.HTTP_400_BAD_REQUEST)
    


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
@admin_required
def delete_client(request):
    """
    Delete a client from the database.
    
    Args:
        request: HTTP request containing:
            - client_id: ID of client to delete
            
    Returns:
        Response with:
        - 200: Client deleted successfully
        - 400: Client not found or invalid data
    """
    if not request.data:
        return Response({"error": "Client details are required"}, status=status.HTTP_400_BAD_REQUEST)
    
    client_id = request.data.get('client_id')
    
    try:
        client = get_object_or_404(Client, id=client_id)
        client.delete()
        return Response({"message": "Client deleted successfully"}, status=status.HTTP_200_OK)
    except Client.DoesNotExist:
        return Response({"error": "Client does not exist"}, status=status.HTTP_400_BAD_REQUEST)
    



@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
@admin_required
def update_contract(request):
    """
    Update an existing contract's details.
    
    Args:
        request: HTTP request containing:
            contract: Dictionary with:
                - contract_id: ID of contract to update
                - Optional fields: end_date, start_date (YYYY-MM-DD format),
                  name, address, postcode, city
                
    Returns:
        Response with:
        - 200: Contract updated successfully
        - 400: Contract not found, invalid data, or invalid date format
        
    Notes:
        - Only updates provided fields
        - Dates must be in YYYY-MM-DD format
    """
    # Validate the request data
    if not request.data:
        return Response({"error": "Contract details are required"}, status=status.HTTP_400_BAD_REQUEST)
    
    # Retrieve the contract details from the request data given the contract object
    contract = request.data.get('contract')
    contract_id = contract.get('contract_id')
    end_date = contract.get('end_date')
    start_date = contract.get('start_date')
    name = contract.get('name')
    address = contract.get('address')
    postcode = contract.get('postcode')
    city = contract.get('city')
    
    try:
        # Get the contract object from the database
        contract = get_object_or_404(Contracts, id=contract_id)
        
        # Convert string dates to datetime.date objects before saving
        if end_date:
            contract.end_date = datetime.strptime(end_date, '%Y-%m-%d').date()
        if start_date:
            contract.start_date = datetime.strptime(start_date, '%Y-%m-%d').date()
        if name:
            contract.name = name
        if address:
            contract.address = address
        if postcode:
            contract.postcode = postcode
        if city:
            contract.city = city
            
        contract.save()    
        
        return Response({"message": "Contract updated successfully"}, status=status.HTTP_200_OK)
    except Contracts.DoesNotExist:
        return Response({"error": "Contract does not exist"}, status=status.HTTP_400_BAD_REQUEST)
    except ValueError:
        return Response({"error": "Invalid date format. Use YYYY-MM-DD"}, status=status.HTTP_400_BAD_REQUEST)
  
  
  
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
@admin_required
def complete_contract(request):
    """
    Mark a contract as completed.
    
    Args:
        request: HTTP request containing:
            - contract_id: ID of contract to complete
            
    Returns:
        Response with:
        - 200: Contract marked as completed
        - 404: Contract not found
        - 400: Invalid data
        
    Notes:
        - Sets contract is_completed flag to True
    """
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
    


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
@admin_required
def delete_contract(request):
    """
    Delete a contract from the database.
    
    Args:
        request: HTTP request containing:
            - contract_id: ID of contract to delete
            
    Returns:
        Response with:
        - 200: Contract deleted successfully
        - 404: Contract not found
        - 400: Invalid data
    """
    if not request.data:
        return Response({"error": "Contract details are required"}, status=status.HTTP_400_BAD_REQUEST)
    
    contract_id = request.data.get('contract_id')
    
    try:
        contract = get_object_or_404(Contracts, id=contract_id)
        contract.delete()
        return Response({"message": "Contract deleted successfully"}, status=status.HTTP_200_OK)
    except Contracts.DoesNotExist:
        return Response({"error": "Contract does not exist"}, status=status.HTTP_404_NOT_FOUND)
    
  
