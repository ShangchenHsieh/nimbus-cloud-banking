from django.urls import path
from .views import ProcessInternalTransferView, ProcessCheckDepositView, Test


urlpatterns = [
    path('internal-transfer/', ProcessInternalTransferView.as_view(), name='internal_transfer'),
    path('deposit-transfer', ProcessCheckDepositView.as_view(), name='check_deposit'),
    path('test/', Test.as_view(), name='testing_endpoint')
]