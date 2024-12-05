from django.urls import path

from .views import ProcessInternalTransferView, ProcessDepositView, Test, ProcessWithdrawalView, GetTransactionsView, SourceAccountView, ProcessRecurringPaymentView, RetrieveRecurringPaymentsView, ProcessExistingRecurringPaymentsView




urlpatterns = [
    path('internal-transfer/', ProcessInternalTransferView.as_view(), name='internal_transfer'),
    path('deposit', ProcessDepositView.as_view(), name='deposit'),
    path('withdrawal', ProcessWithdrawalView.as_view(), name='withdraw'),
    path('user-transactions/<str:account_number>/', GetTransactionsView.as_view(), name='get_transactions'),
    path("source-account/", SourceAccountView.as_view(), name="source-account"),
    path('user-transactions/<str:account_number>/', GetTransactionsView.as_view(), name='get_transactions'),
    path('recurring-payment', ProcessRecurringPaymentView.as_view(), name='recurring-payment'),
    path('active-recurring-payments/<str:account_number>/', RetrieveRecurringPaymentsView.as_view(), name='active-recurring-payments'),
    path('process-recurring-payments/', ProcessExistingRecurringPaymentsView.as_view(), name='process-recurring-payments'),
    path('test', Test.as_view(), name='testing_endpoint'),
]