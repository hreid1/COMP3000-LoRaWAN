from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import LorawanViewSet

lorawan_router = DefaultRouter()
lorawan_router.register(r'Lorawan', LorawanViewSet)