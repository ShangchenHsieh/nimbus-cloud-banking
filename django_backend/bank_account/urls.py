from django.urls import path

from .views import AccountInfoView
from .views import AccountTypesView
from .views import AcccountNumView, CreateAccountView

urlpatterns = [
    path('account-info/<str:account_type>/', AccountInfoView.as_view(), name='account-info'),
    path('account-types/', AccountTypesView.as_view(), name='account_types'),
    path('account-number/<str:user_id>/', AcccountNumView.as_view(), name='account_number'),
    path('create-account/', CreateAccountView.as_view(), name='create-account'),
]