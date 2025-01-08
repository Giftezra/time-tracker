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
 
from .validation import owner_required, staff_required, admin_required, superuser_required
from django.core.exceptions import ValidationError
from ...models import Company, Client, Contracts, Shift


from ...serializer import ContractsSerializer, ClientSerializer
from datetime import datetime


""" Method creates a new client.
    The permission validation is checked to ensure only the owner and the admin can create a new client.
    The client details are passed in the request body."""
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
@admin_required
def create_client(request):
    # Retrieve the company from the company tag assoicated with the request user
    try:
      company = request.user.company
    except Company.DoesNotExist:
      return Response({"error": "This user is unassigned to a company"}, status=status.HTTP_400_BAD_REQUEST)

    # Create a new client with request data
    # Return a success message if the client is created successfully
    # Return an error message if the client is not created successfully
    try:
      client = Client.objects.create(
        company=company,
        name=request.data.get('name'),
        email=request.data.get('email'),
        phone=request.data.get('phone'),
        address=request.data.get('address'),
        postcode=request.data.get('postcode'),
        city=request.data.get('city'),
        country=request.data.get('country'),
        created_by=request.user
      )
      client.save()
      return Response({"message": "Client created successfully"}, status=status.HTTP_201_CREATED)
    except ValidationError as e:
      return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    

""" Create a new contract for the client"""
@api_view(['POST'])
@permission_classes([IsAuthenticated])
@admin_required
def create_contract(request):
  # Validate request data
  if not request.data:
    return Response({"error": "Contract details are required"}, status=status.HTTP_400_BAD_REQUEST)
  
  """ Retrieve teh client id from the request.
      Use the client id to retrive the client object.
      Get the company object from the client object.
      Use both object to associate the contract with the client and the company."""
  try:
    client = Client.objects.get(id=request.data.get('client_id'))
    company = client.company
    
    # Create a new contract with the request data
    
    contract = Contracts.objects.create(
      client=client,
      company=company,
      name=request.data.get('name'),
      description=request.data.get('description'),
      address=request.data.get('address'),
      postcode=request.data.get('postcode'),
      city=request.data.get('city'),
      start_date=request.data.get('start_date'),
      end_date=request.data.get('end_date'),
      created_by=request.user
    )
    
    # Send am email to the owner of the company whenever a new contract is created
    contract.save()
    return Response({"message": "Contract created successfully"}, status=status.HTTP_201_CREATED)
  except Client.DoesNotExist:
    return Response({"error": "Client does not exist"}, status=status.HTTP_400_BAD_REQUEST)
  
  
  
  
""" Use the client id to retrieve the client object and all the associated contracts.
    Serialize the contracts and return the data."""
@api_view(['GET'])
@permission_classes([IsAuthenticated])
@admin_required
def get_contract_and_shifts(request):
  # Retrieve the client id from the request
  # Use the client id to retrieve the client object
  try:
    id = request.data.get('client_id')
    client = get_object_or_404(Client, id=id)
    contracts = Contracts.objects.filter(client=client)
    
    client_contract_details =[]
    
    # Loop the contracts and fetch task associated with them
    # reverse engineer the task to get the staff de
    for contract in contracts:
      staff_list = []
      
      tasks = contract.task_set.all()
      for task in tasks:
        shift = Shift.objects.get(task=task)
        # Get the details of the staff associated with the shift
        shift_members = set(
          user for shift in shift for user in shift.staff.all()
        )
        
        # Loop through the staff members and get their details of each user
        for staff in shift_members:
          staff_list.append({
            'staff_id': staff.id,
            'staff_name': staff.name,
            'staff_email': staff.email,
            'staff_phone': staff.phone,
          })
        # Append the client, contract, and staff details to the client_contract_details list
        client_contract_details.append({
        'client_name': client.name,
        'contract_id' : contract.id,
        'contract_name': contract.name,
        'information': contract.description,
        'contract_address': contract.address,
        'contract_postcode': contract.postcode,
        'contract_city': contract.city,
        'employees': staff_list,
        'start_date': task.start_date,
        'end_date': task.end_date,
        'start_time': task.start_time,
        'end_time': task.end_time
        })
    return Response({'client_contract_details': client_contract_details}, status=status.HTTP_200_OK)
    # Serialize the contracts and return the data
  except Client.DoesNotExist:
    return Response({"error": "Client does not exist"}, status=status.HTTP_400_BAD_REQUEST)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
@admin_required
def get_client_and_contracts(request):
    # Retrieve the company id from the request
    # Use the company id to retrieve the company object
    client_list = []
    
    try:
      company = request.user.company
      clients = Client.objects.filter(company=company)
      
      for client in clients:
        contracts = Contracts.objects.filter(client=client)
        contract_list = []
        
        for contract in contracts:
          contract_list.append({
            'contract_id': contract.id,
            'name': contract.name,
            'address': contract.address,
            'postcode': contract.postcode,
            'city': contract.city,
            'description': contract.description,
            'start_date': contract.start_date,
            'end_date': contract.end_date,
          })
        client_list.append({
          'client_id': client.id,
          'name': client.name,
          'address': client.address,
          'postcode': client.postcode,
          'email': client.email,
          'phone': client.phone,
          'city': client.city,
          'country': client.country,
          'contracts': contract_list
        })
      return Response({'client_details': client_list}, status=status.HTTP_200_OK)
    except Client.DoesNotExist:
      return Response({"error": "Client does not exist"}, status=status.HTTP_400_BAD_REQUEST)
    
    
""" Method is designed to update contracts, extending the contract due and expiry date."""
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
@admin_required
def update_contract(request):
  # Ensure the request data is valid
  if not request.data:
    return Response({"error": "Contract details are required"}, status=status.HTTP_400_BAD_REQUEST)
  
  # Get the dates to update the contract from the request data
  # Use the contract id to retrieve the contract object
  # if the contract object is not found return an error message
  contract_id = request.data.get('contract_id')
  end_date = request.data.get('end_date')
  
  try:
    contract = get_object_or_404(Contracts, id=contract_id)
    contract.end_date = end_date
    contract.save()
    return Response({"message": "Contract updated successfully"}, status=status.HTTP_200_OK)
  except Contracts.DoesNotExist:
    return Response({"error": "Contract does not exist"}, status=status.HTTP_400_BAD_REQUEST)
  
  
  
@api_view(['POST'])
@permission_classes([IsAuthenticated])
@admin_required
def complete_contract(request):
  """ The method is used to end  the contract between parties automatically when the end date arrives.
  The method also uses the contract id to update the contracts status to completed."""
  if not request.data:
    return Response({"error": "Contract details are required"}, status=status.HTTP_400_BAD_REQUEST)
  
  contract_id = request.data.get('contract_id')
  
  try:
    contract = get_object_or_404(Contracts, id=contract_id)
    contract.status = 'completed'
    contract.save()
    return Response({"message": "Contract completed successfully"}, status=status.HTTP_200_OK)
  except Contracts.DoesNotExist:
    return Response({"error": "Contract does not exist"}, status=status.HTTP_400_BAD_REQUEST) 
  