from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import RegisterView
from .views import LoginView
from .views import UserProfileView
from .views import AdminLoginView
from .views import Test

urlpatterns = [
    # TokenObtainPairView: Provides initial acces token(10 mins) and refresh token used to trade for longer access token
    path('/', Test.as_view(), name='test'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    # TokenRefreshView: Trades refresh token for longer access token(1 day)
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # Registration api
    path('register/', RegisterView.as_view(), name='register'),
    # Login Api
    path('login/', LoginView.as_view(), name='login'),
    path('admin-login/', AdminLoginView.as_view(), name='admin-login'),
    path('user/', UserProfileView.as_view(), name='user-profile'),
]