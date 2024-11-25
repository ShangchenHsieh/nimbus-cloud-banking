from django.urls import path
from .views import MapsView

urlpatterns = [
    # MapsView: finds all Chase ATMs in radius
    path('searchATMs/', MapsView.as_view(), name='searchATMs')
]