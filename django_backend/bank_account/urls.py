from django.urls import path

from .views import BalanceView
from .views import AccountTypesView

urlpatterns = [
    path('balance/<str:account_type>/', BalanceView.as_view(), name='balance'),
    path('account-types/', AccountTypesView.as_view(), name='account_types'),
]