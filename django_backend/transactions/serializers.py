from rest_framework import serializers
from .models import InternalAccountTransfer
from django.db import transaction
from bank_account.models import BankAccount

class ProcessInternalTransferSerializer(serializers.ModelSerializer):
    source_account_number = serializers.CharField(max_length=10)
    destination_account_number = serializers.CharField(max_length=10)
    amount = serializers.DecimalField(max_digits=10, decimal_places=2)
    provider = serializers.CharField(max_length=255, required=False, allow_blank=True)

    class Meta:
        model = InternalAccountTransfer
        fields = ['source_account_number', 'destination_account_number', 'amount', 'provider']

    def create(self, validated_data):
        source_account_number = validated_data['source_account_number']
        destination_account_number = validated_data['destination_account_number']
        amount = validated_data['amount']
        # provider can be empty, thus use get() and return None if 'provider' key is not found in dictionary
        provider = validated_data.get('provider', None)
        
        try:
            source_account = BankAccount.objects.get(account_number=source_account_number)
        except BankAccount.DoesNotExist:
            raise serializers.ValidationError("Source account number is invalid or may not exist.")
        
        try:
            destination_account = BankAccount.objects.get(account_number=destination_account_number)
        except BankAccount.DoesNotExist:
            raise serializers.ValidationError("Destination account number is invalid or may not exist.")
            
        if source_account == destination_account:
            raise serializers.ValidationError("Souce and destination accounts cannot be the same account")
        
        # NOTICE: creating two transfer records, one for the account that is sending the money, another for the account that is receiveing the money
        with transaction.atomic():
            sending_transfer = InternalAccountTransfer.objects.create(
                bank_account=source_account,
                other_bank_account=destination_account,
                amount=amount,
                provider=provider,
                transaction_type='transfer out',
            )
            recieving_transfer = InternalAccountTransfer.objects.create(
                bank_account=destination_account,
                other_bank_account=source_account,
                amount=amount,
                provider=provider,
                transaction_type='transfer in',
            )
        
        return sending_transfer