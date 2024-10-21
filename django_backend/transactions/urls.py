from django.urls import path
from .views import ProcessInternalTransferView

urlpatterns = [
    path('internal-transfer/', ProcessInternalTransferView.as_view(), name='internal_transfer'),
]