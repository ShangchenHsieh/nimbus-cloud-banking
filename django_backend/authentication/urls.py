from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import RegisterView
from .views import LoginView

urlpatterns = [
    # TokenObtainPairView: Provides initial acces token(10 mins) and refresh token used to trade for longer access token
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    # TokenRefreshView: Trades refresh token for longer access token(1 day)
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # Registration api
    path('register/', RegisterView.as_view(), name='register'),
    # Login Api
    path('login/', LoginView.as_view(), name='login'),
]