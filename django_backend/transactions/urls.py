from django.urls import path
from .views import ProcessInternalTransferView, ProcessDepositView, Test, ProcessWithdrawalView


urlpatterns = [
    path('internal-transfer/', ProcessInternalTransferView.as_view(), name='internal_transfer'),
    path('deposit', ProcessDepositView.as_view(), name='deposit'),
    path('withdrawal', ProcessWithdrawalView.as_view(), name='withdraw'),
    path('test', Test.as_view(), name='testing_endpoint')
]