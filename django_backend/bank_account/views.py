from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import AccountInfoSerializer, CreateAccountSerializer, UserAndAccountDetailsSerializer, DeleteAccountSerializer
from .models import BankAccount
from rest_framework import status


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
    
class AcccountNumView(APIView): 
    permission_classes = [IsAuthenticated]
    
    def get(self, request, user_id): 
        id = user_id
        account_numbers = BankAccount.objects.filter(user=id).values_list('account_number', flat=True)
        return Response({"account_number": account_numbers})
        
        
class CreateAccountView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = CreateAccountSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            account = serializer.save()
            return Response({
                "message": "Bank account created successfully",
                "account_number": account.account_number,
                "account_type": account.account_type,
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class AllUserAndAccountsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        accounts = BankAccount.objects.select_related('user').all()
        serializer = UserAndAccountDetailsSerializer(accounts, many=True)
        return Response(serializer.data)

class DeleteAccountView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        serializer = DeleteAccountSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            account_type = serializer.validated_data['account_type']

            # Delete the account
            BankAccount.objects.filter(user=user, account_type=account_type).delete()
            if not BankAccount.objects.filter(user=user).exists():
                # If no accounts remain, delete the user
                user.delete()
                return Response(
                    {"message": "Last remaming bank account deleted, user credentials have been deleted successfully."},
                    status=status.HTTP_200_OK
                )

            # If accounts remain, return a success message for account deletion
            return Response(
                {"message": "Account deleted successfully."},
                status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
