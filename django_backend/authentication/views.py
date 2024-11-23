from django.shortcuts import render

# importing CustomUser for authentication.
# Doc link: https://docs.djangoproject.com/en/5.1/ref/contrib/auth/
from .models import CustomUser

# APIView class. Has built in HTTP methods(get(), post(), put()). Our AuthenticationView extends from this
# Doc link: https://www.django-rest-framework.org/api-guide/views/
from rest_framework.views import APIView

# status used to support HTTP status codes such as 404 Not Found within our HTTP reponses
# Doc link: https://www.django-rest-framework.org/api-guide/status-codes/
from rest_framework import status

# Response function supporting HTTP responses. Views return this funcion
# Doc link: https://www.django-rest-framework.org/tutorial/2-requests-and-responses/
from rest_framework.response import Response

# AllowAny permissions class. Grants access of the View it is associated with to any user(no authentication required)
# Doc link: https://www.django-rest-framework.org/api-guide/permissions/
from rest_framework.permissions import AllowAny

# Supports RefreshToken management.
from rest_framework_simplejwt.tokens import RefreshToken

from rest_framework.permissions import IsAuthenticated


from .serializers import RegisterSerializer
from .serializers import LoginSerializer
from .serializers import UserProfileSerializer
from .serializers import AdminLoginSerializer

class RegisterView(APIView):
    """
    API View to register a new user in the system.

    This view accepts an HTTP POST request containing the user's email and password
    and registers a new user. Upon successful registration, the response will
    include a JWT (JSON Web Token) for authentication.

    Permissions:
    - AllowAny: Anyone can access this endpoint, even unauthenticated users.

    Methods:
    - post: Handle the registration of a new user.
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        """
        Register a new user.

        Request Body Parameters:
        - email (str): The email of the user, which will be used as the username.
        - password (str): The password for the user account.

        Returns:
        - HTTP 201 Created: If the user is successfully created.
          {
              "refresh": "<refresh_token>",
              "access": "<access_token>"
          }

        - HTTP 400 Bad Request: If any validation error occurs.
          {
              "Error": "Error message"
          }

        Example:
        POST /auth/register/
        {
            "email": "user@example.com",
            "password": "securepassword"
        }

        Response:
        {
            "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
            "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
        }
        """
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            # Django REST internally calls create() from RegisterSerializer when save() is called, passing data from request to the create function
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        
class LoginView(APIView):
    permission_classes=[AllowAny]
    
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        # Django REST insternally calls validate() within is_valid()
        if serializer.is_valid():
            # Data dict returned from validate() is merged into validated_data dict
            user = serializer.validated_data['user']
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class AdminLoginView(APIView):
    permission_classes=[AllowAny]
    
    def post(self, request):
        serializer = AdminLoginSerializer(data=request.data)
        # Django REST insternally calls validate() within is_valid()
        if serializer.is_valid():
            # Data dict returned from validate() is merged into validated_data dict
            user = serializer.validated_data['user']
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user 

        if not user:
            return Response({'error': 'User not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)

        # use serializer
        serializer = UserProfileSerializer(user)
        print(f"User data: {serializer.data}")
        
        if serializer.data:
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response({'error': 'Cannot retrieve user data'}, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request):
        user = request.user
        serializer = UserProfileSerializer(user, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()  
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class Test(APIView): 
    def test(self, request):
        return {'message': 'hello world'}