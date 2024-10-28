from rest_framework import serializers
from .models import InternalAccountTransfer, WithdrawalTransaction, DepositTransaction
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
        provider = validated_data.get('provider', None)
        
        # Fetch source and destination accounts
        try:
            source_account = BankAccount.objects.get(account_number=source_account_number)
        except BankAccount.DoesNotExist:
            print("source doesnt exist.")
            raise serializers.ValidationError("Source account number is invalid or may not exist.")
        
        try:
            destination_account = BankAccount.objects.get(account_number=destination_account_number)
        except BankAccount.DoesNotExist:
            print("Invalid dest.")
            raise serializers.ValidationError("Destination account number is invalid or may not exist.")
        
        # Ensure source and destination accounts are different
        if source_account == destination_account:
            print("same acc.")
            raise serializers.ValidationError("Source and destination accounts cannot be the same account.")
        
        # Check sufficient balance in source account
        if source_account.balance < amount:
            print("Insufficient funds for the transfer.")
            raise serializers.ValidationError("Insufficient funds in the source account.")
        
        # Perform atomic transfer
        with transaction.atomic():
            # Deduct from source account and create sending record
            source_account.balance -= amount
            source_account.save()
            sending_transfer = InternalAccountTransfer.objects.create(
                bank_account=source_account,
                other_bank_account=destination_account,
                amount=amount,
                provider=provider,
                transaction_type='transfer out',
                status='completed'
            )
            
            # Add to destination account and create receiving record
            destination_account.balance += amount
            destination_account.save()
            receiving_transfer = InternalAccountTransfer.objects.create(
                bank_account=destination_account,
                other_bank_account=source_account,
                amount=amount,
                provider=provider,
                transaction_type='transfer in',
                status='completed'
            )
        
        return sending_transfer

    
class ProcessDepositSerializer(serializers.ModelSerializer): 
    
    # incoming data validation
    account_number = serializers.CharField(max_length=10)
    amount = serializers.DecimalField(max_digits=10, decimal_places=2)
    
    # data fields and model 
    class Meta: 
        model = DepositTransaction
        fields = ['account_number', 'amount']
    
    
    def create(self, validated_data):
        account_number = validated_data['account_number']
        amount = validated_data['amount']
        
        
        try:
            account_number = BankAccount.objects.get(account_number=account_number)
        except BankAccount.DoesNotExist:
            raise serializers.ValidationError("Account number is invalid or may not exist.")
        if amount <= 0: 
            raise serializers.ValidationError("Deposit amount must be greater than zero.")
        deposit = DepositTransaction.objects.create(
                bank_account=account_number,      
                amount=amount,
                transaction_type='deposit',
            )
        return deposit
    
class ProcessWithdrawalSerializer(serializers.ModelSerializer): 
    
    account_number = serializers.CharField(max_length=10)
    amount = serializers.DecimalField(max_digits=10, decimal_places=2)
    
    class Meta: 
        model = WithdrawalTransaction
        fields = ['account_number', 'amount']
    
    
    def create(self, validated_data):
        account_number = validated_data['account_number']
        amount = validated_data['amount']
        try:
            account_number = BankAccount.objects.get(account_number=account_number)
        except BankAccount.DoesNotExist:
            raise serializers.ValidationError("Account number is invalid or may not exist.")
        if amount <= 0: 
            raise serializers.ValidationError("Withdrawal amount must be greater than zero.")
        if amount > account_number.balance:
            raise serializers.ValidationError("Withdrawal Amount exceeds account balance")
        withdraw = WithdrawalTransaction.objects.create(
                bank_account=account_number,      
                amount=amount,
                transaction_type='withdrawal',
            )
        return withdraw
        
class DisplayDepositTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = DepositTransaction
        fields = ['id', 'transaction_date', 'provider', 'amount', 'transaction_type']

class DisplayWithdrawalTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = WithdrawalTransaction
        fields = ['id', 'transaction_date', 'provider', 'amount', 'transaction_type']

class DisplayInternalAccountTransferSerializer(serializers.ModelSerializer):
    class Meta:
        model = InternalAccountTransfer
        fields = ['id', 'transaction_date', 'provider', 'amount', 'transaction_type']
        
        
        
        
        
    
    
class TestSerializer(serializers.ModelSerializer): 
    def test():
        return {'message': 'success!'}