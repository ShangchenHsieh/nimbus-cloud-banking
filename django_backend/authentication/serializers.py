from rest_framework import serializers
from .models import CustomUser
from django.contrib.auth import authenticate

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['email', 'first_name', 'last_name', 'phone', 'password']
        # password set to write only such that it can only be provided when creating a user but not in API responses
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            phone=validated_data['phone']
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
        