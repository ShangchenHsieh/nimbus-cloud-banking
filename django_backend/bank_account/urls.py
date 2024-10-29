from django.urls import path

from .views import BalanceView
from .views import AccountTypesView
from .views import AcccountNumView

urlpatterns = [
    path('balance/<str:account_type>/', BalanceView.as_view(), name='balance'),
    path('account-types/', AccountTypesView.as_view(), name='account_types'),
    path('account-number/<str:user_id>/', AcccountNumView.as_view(), name='account_number')
]