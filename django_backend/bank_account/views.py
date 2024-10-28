from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import AccountInfoSerializer
from .models import BankAccount

class AccountInfoView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, account_type):
        user = request.user
        try:
            account = BankAccount.objects.get(user=user, account_type=account_type)
            serializer = AccountInfoSerializer(account)
            return Response(serializer.data)
        except BankAccount.DoesNotExist:
            return Response({"error": f"User does not have {account_type} account"}, status=404)

class AccountTypesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        # retrieves a list of all accounts associated with the user in a list such as ['checking', 'savings']
        accounts = BankAccount.objects.filter(user=user).values_list('account_type', flat=True)
        return Response(accounts)