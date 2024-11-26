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

class DeleteAccountSerializer(serializers.Serializer):
    email = serializers.EmailField()
    account_type = serializers.CharField()

    def validate(self, data):
        email = data.get('email')
        account_type = data.get('account_type')

        # Ensure a user with the provided email exists
        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError({"email": "User with this email does not exist."})

        # Ensure the account with the provided account type exists for the user
        if not BankAccount.objects.filter(user=user, account_type=account_type).exists():
            raise serializers.ValidationError({"account_type": "No account of this type exists for the user."})

        data['user'] = user
        return data
