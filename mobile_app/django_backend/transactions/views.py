from .serializers import ProcessInternalTransferSerializer, ProcessDepositSerializer, ProcessWithdrawalSerializer, DisplayDepositTransactionSerializer, DisplayWithdrawalTransactionSerializer, DisplayInternalAccountTransferSerializer
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework import status
from bank_account.models import BankAccount
from .models import DepositTransaction, WithdrawalTransaction, InternalAccountTransfer
from rest_framework.parsers import MultiPartParser
from PIL import Image
import pytesseract  
import numpy as np
import re
import logging

logger = logging.getLogger(__name__)

# Initialize easyOCR reader
#reader = easyocr.Reader(['en'])

def reading_check(image_path):

    # Load the image
    image = Image.open(image_path)
    width, height = image.size

    # Crop image to only see the last line on check
    cropped_image = image.crop((0, height - 100, width, height))

    # Convert to grayscale for better OCR accuracy
    grayscale_image = cropped_image.convert("L")  # "L" is luminance for grayscale
    
    # Apply OCR using pytesseract
    detected_text = pytesseract.image_to_string(grayscale_image)

    # Remove white spaces and print detected text for debugging
    final_text = detected_text.replace("1:", "").strip()
    print("Final Text  --->", final_text)

    # Clean up the text to keep only digits and spaces
    cleaned_text = re.sub(r'[^\d\s]', '', final_text)
    print("Cleaned Text  --->", cleaned_text)

    # Extract numeric components
    numbers = re.findall(r'\d+', cleaned_text)

    # Check if we have enough numbers for routing, account, and check numbers
    if len(numbers) >= 3:
        routing_number = numbers[0]
        account_number = numbers[1]
        check_number = numbers[2]
        return {
            "Routing Number": routing_number,
            "Account Number": account_number,
            "Check Number": check_number
        }
    else:
        return "Didn't work, handle in some way maybe..."

class ProcessCheckImageView(APIView):
    parser_classes = [MultiPartParser]

    def post(self, request):
        try:
            # Check if 'check_image' is in the uploaded files
            image_file = request.FILES.get('check_image')
            if not image_file:
                logger.error("No image file provided in request.")
                return Response({"error": "No image file provided."}, status=status.HTTP_400_BAD_REQUEST)

            # Save the image temporarily
            temp_image_path = 'temp_check_image.png'
            try:
                with open(temp_image_path, 'wb') as f:
                    f.write(image_file.read())
            except Exception as e:
                logger.error(f"Failed to save image file: {e}")
                return Response({"error": "Failed to save the image file."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            # Process the image using the OCR function
            
            try:
                result = reading_check(temp_image_path)
                
            except Exception as e:
                result = reading_check(temp_image_path)
                print("Output of reading_check:", result, flush=True)
                logger.error(f"Error processing image in OCR function: {e}")
                return Response({"error": "Error processing the image."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            # Check if the result contains an error
            if "error" in result:
                logger.error(f"OCR processing error: {result['error']}")
                return Response({"error": result['error']}, status=status.HTTP_400_BAD_REQUEST)

            return Response(result, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"An unexpected error occurred: {str(e)}")
            return Response({"error": "An unexpected error occurred while processing the image."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ProcessInternalTransferView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        serializer = ProcessInternalTransferSerializer(data=request.data)

        if serializer.is_valid():
            try:
                # .save() creates two records but only returns the record for the account that sent the money
                transfer = serializer.save()
                return Response(
                    {"message": "Transfer successful",
                     "transfer_id": transfer.id}, 
                    status=status.HTTP_201_CREATED
                )
            except Exception as e:
                # Catch exceptions like the insufficient funds that is raised in update_balance() of Transfer model
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
class ProcessDepositView(APIView): 
    permission_classes = [IsAuthenticated] # add IsAuthenticated after demo
    
    def post(self, request): 
        serializer = ProcessDepositSerializer(data=request.data)
        if serializer.is_valid(): 
            try: 
                deposit = serializer.save()
                return Response(
                    {"message": "Deposit successful",
                     'id': deposit.id, 
                     'transaction_type': deposit.transaction_type, 
                     'amount': deposit.amount, 
                     'status': deposit.status, 
                     'transaction_date': deposit.transaction_date}, 
                    status=status.HTTP_200_OK
                )
            except Exception as e: 
                # Catch exceptions like the insufficient funds that is raised in update_balance() of Transfer model
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
class ProcessWithdrawalView(APIView): 
    permission_classes = [IsAuthenticated] # add IsAuthenticated after demo
    
    def post(self, request): 
        serializer = ProcessWithdrawalSerializer(data=request.data)
        if serializer.is_valid(): 
            try: 
                withdraw = serializer.save()
                return Response(
                    {"message": "Withdraw Success", 
                     'id': withdraw.id, 
                     'transaction_type': withdraw.transaction_type, 
                     'amount': withdraw.amount, 
                     'status': withdraw.status, 
                     'transaction_date': withdraw.transaction_date}, 
                    status=status.HTTP_200_OK
                )
            except Exception as e: 
                # Catch exceptions like the insufficient funds that is raised in update_balance() of Transfer model
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)    
    
class GetTransactionsView(APIView):   
    def get(self, request, account_number):
        try:
            bank_account = BankAccount.objects.get(account_number=account_number)
        except BankAccount.DoesNotExist:
            return Response({"error": "Bank account does not exist."}, status=status.HTTP_404_NOT_FOUND)

        # Retrieve all different tracactions records matching the given bank account number
        deposit_transactions = DepositTransaction.objects.filter(bank_account=bank_account)
        withdrawal_transactions = WithdrawalTransaction.objects.filter(bank_account=bank_account)
        transfers = InternalAccountTransfer.objects.filter(bank_account=bank_account)

        # Serialize the transactions to send form http response
        deposit_serializer = DisplayDepositTransactionSerializer(deposit_transactions, many=True)
        withdrawal_serializer = DisplayWithdrawalTransactionSerializer(withdrawal_transactions, many=True)
        internal_transfer_serializer = DisplayInternalAccountTransferSerializer(transfers, many=True)

        response_data = {
            "deposits": deposit_serializer.data,
            "withdrawals": withdrawal_serializer.data,
            "transfers": internal_transfer_serializer.data,
        }
        
        return Response(response_data, status=status.HTTP_200_OK)
    
    

    
class GetTransactionsView(APIView):   
    def get(self, request, account_number):
        try:
            bank_account = BankAccount.objects.get(account_number=account_number)
        except BankAccount.DoesNotExist:
            return Response({"error": "Bank account does not exist."}, status=status.HTTP_404_NOT_FOUND)

        # Retrieve all different tracactions records matching the given bank account number
        deposit_transactions = DepositTransaction.objects.filter(bank_account=bank_account)
        withdrawal_transactions = WithdrawalTransaction.objects.filter(bank_account=bank_account)
        transfers = InternalAccountTransfer.objects.filter(bank_account=bank_account)

        # Serialize the transactions to send form http response
        deposit_serializer = DisplayDepositTransactionSerializer(deposit_transactions, many=True)
        withdrawal_serializer = DisplayWithdrawalTransactionSerializer(withdrawal_transactions, many=True)
        internal_transfer_serializer = DisplayInternalAccountTransferSerializer(transfers, many=True)

        response_data = {
            "deposits": deposit_serializer.data,
            "withdrawals": withdrawal_serializer.data,
            "transfers": internal_transfer_serializer.data,
        }
        
        return Response(response_data, status=status.HTTP_200_OK)
    
    
class SourceAccountView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Retrieve the source account number of the authenticated user.
        """
        try:
            # Fetch the user's primary source account
            source_account = BankAccount.objects.get(user=request.user)
            return Response({"account_number": source_account.account_number}, status=status.HTTP_200_OK)
        except BankAccount.DoesNotExist:
            return Response({"error": "Source account not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
class GetSourceAccountView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            # Assuming each user has one primary bank account
            source_account = BankAccount.objects.get(user=request.user)
            return Response({"source_account_number": source_account.account_number}, status=status.HTTP_200_OK)
        except BankAccount.DoesNotExist:
            return Response({"error": "Source account not found for the current user."}, status=status.HTTP_404_NOT_FOUND)

class Test(APIView):
    def get(self, request): 
        data = {'name': 'sean',}
        return Response(data, status=status.HTTP_200_OK)