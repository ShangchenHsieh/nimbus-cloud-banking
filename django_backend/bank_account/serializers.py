from rest_framework import serializers
from .models import BankAccount, account_number_generator

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