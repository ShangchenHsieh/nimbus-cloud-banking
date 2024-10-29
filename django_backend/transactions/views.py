from .serializers import ProcessInternalTransferSerializer, ProcessDepositSerializer, ProcessWithdrawalSerializer
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework import status

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
    
class Test(APIView):
    def get(self, request): 
        data = {'name': 'sean',}
        return Response(data, status=status.HTTP_200_OK)