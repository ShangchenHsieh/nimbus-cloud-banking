from .serializers import ProcessInternalTransferSerializer, ProcessCheckDepositSerializer
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
                    {"message": "Transfer successful", "transfer_id": transfer.id}, 
                    status=status.HTTP_201_CREATED
                )
            except Exception as e:
                # Catch exceptions like the insufficient funds that is raised in update_balance() of Transfer model
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
class ProcessCheckDepositView(APIView): 
    permission_classes = []
    
    def post(self, request): 
        serializer = ProcessCheckDepositSerializer(data=request.data)
        if serializer.is_valid(): 
            try: 
                deposit = serializer.save()
                return Response(
                    {"message": "deposit successful", "deposit": deposit}, 
                    status=status.HTTP_201_CREATED
                )
            except Exception as e: 
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
    
class Test(APIView):
    def get(self, request): 
        data = {'name': 'sean',}
        return Response(data, status=status.HTTP_200_OK)