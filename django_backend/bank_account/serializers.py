from rest_framework import serializers
from .models import BankAccount, account_number_generator
from authentication.models import CustomUser

class AccountInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = BankAccount
        fields = ['account_number', 'account_type', 'balance']
        
        
class CreateAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = BankAccount
        fields = ['account_type']

    def create(self, validated_data):
        user = self.context['request'].user
        account = BankAccount(
            user=user,
            account_number=account_number_generator(),
            account_type=validated_data['account_type'],
            status='active'
        )
        account.save()
        return account
    
class UserAndAccountDetailsSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(source="user.id")
    first_name = serializers.CharField(source="user.first_name")
    last_name = serializers.CharField(source="user.last_name")
    phone = serializers.CharField(source="user.phone")
    email = serializers.EmailField(source="user.email")

    class Meta:
        model = BankAccount
        fields = [
            'user_id', 'first_name', 'last_name', 'phone', 'email',
            'account_type', 'account_number', 'balance', 'status'
        ]