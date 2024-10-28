from .serializers import ProcessInternalTransferSerializer, ProcessDepositSerializer, ProcessWithdrawalSerializer
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework import status
from bank_account.models import BankAccount

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
    permission_classes = [] # add IsAuthenticated after demo
    
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
    permission_classes = [] # add IsAuthenticated after demo
    
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