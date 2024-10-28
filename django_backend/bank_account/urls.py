from django.urls import path

from .views import AccountInfoView
from .views import AccountTypesView

urlpatterns = [
    path('account-info/<str:account_type>/', AccountInfoView.as_view(), name='account-info'),
    path('account-types/', AccountTypesView.as_view(), name='account_types'),
]