from rest_framework import serializers
from .models import CustomUser
from django.contrib.auth import authenticate

from bank_account.models import BankAccount, account_number_generator

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['email', 'first_name', 'last_name', 'phone', 'password']
        # password set to write only such that it can only be provided when creating a user but not in API responses
        extra_kwargs = {'password': {'write_only': True}}

    def validate_email(self, value):
        admin_email = "admin@nimbusbanking.com"  
        if value.lower() == admin_email.lower():
            raise serializers.ValidationError("This email is reserved for admin use only.")
        return value


    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            phone=validated_data['phone']
        )
        # Automatically create an associated checkings account upon user registration
        BankAccount.objects.create(
            user=user,
            account_type = 'checking',
            status = 'active',
            account_number = account_number_generator()
        )
        
        return user
    
    
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, credentials):
        # retuns CustomUser object if account is present in DB, returns None if not present in DB
        user = authenticate(email=credentials['email'], password=credentials['password'])
        
        # raise Error if account it not in DB
        if user is None:
            raise serializers.ValidationError("Invalid log in credentials")
        
        # Return the existing validated user in a dict for further processing in LoginView
        data = {
        'user': user,
        }
        return data
    
class AdminLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, credentials):
        # Authenticate the user
        user = authenticate(email=credentials['email'], password=credentials['password'])
        
        # Raise an error if the user is not found
        if user is None:
            raise serializers.ValidationError("Invalid login credentials")

        # Check if the authenticated user is an admin (is_superuser is True)
        if not user.is_superuser:
            raise serializers.ValidationError("You do not have admin privileges")
        
        # Return the validated admin user in a dictionary for further processing
        data = {
            'user': user,
        }
        return data
        
class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['first_name', 'last_name', 'phone', 'email']

    def update(self, instance, validated_data):
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.phone = validated_data.get('phone', instance.phone)
        instance.email = validated_data.get('email', instance.email)

        #havent checked functionality of the pw updating yet, will do later
        password = validated_data.get('password', None)
        if password:
            instance.set_password(password)
        
        instance.save()
        return instance