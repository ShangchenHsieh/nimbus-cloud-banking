from django.urls import path

from .views import BalanceView

urlpatterns = [
    path('balance/<str:account_type>/', BalanceView.as_view(), name='balance'),
]