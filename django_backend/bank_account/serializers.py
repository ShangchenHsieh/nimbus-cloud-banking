from rest_framework import serializers
from .models import BankAccount

class BalanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = BankAccount
        fields = ['account_number', 'account_type', 'balance']