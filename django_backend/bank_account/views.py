from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import BalanceSerializer
from .models import BankAccount

class BalanceView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, account_type):
        user = request.user
        try:
            account = BankAccount.objects.get(user=user, account_type=account_type)
            serializer = BalanceSerializer(account)
            return Response(serializer.data)
        except BankAccount.DoesNotExist:
            return Response({"error": f"User does not have {account_type} account"}, status=404)
