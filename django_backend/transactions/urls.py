from django.urls import path
from .views import ProcessInternalTransferView, ProcessDepositView, Test, ProcessWithdrawalView, SourceAccountView, GetTransactionsView


urlpatterns = [
    path('internal-transfer/', ProcessInternalTransferView.as_view(), name='internal_transfer'),
    path('deposit', ProcessDepositView.as_view(), name='deposit'),
    path('withdrawal', ProcessWithdrawalView.as_view(), name='withdraw'),
    path("source-account/", SourceAccountView.as_view(), name="source-account"),
    path('user-transactions/<str:account_number>/', GetTransactionsView.as_view(), name='get_transactions'),
    path('test', Test.as_view(), name='testing_endpoint'),
]