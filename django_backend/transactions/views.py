from .serializers import ProcessInternalTransferSerializer, ProcessDepositSerializer, ProcessWithdrawalSerializer, DisplayDepositTransactionSerializer, DisplayWithdrawalTransactionSerializer, DisplayInternalAccountTransferSerializer
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework import status
from bank_account.models import BankAccount
from .models import DepositTransaction, WithdrawalTransaction, InternalAccountTransfer




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


