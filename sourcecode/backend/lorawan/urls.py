from django.urls import path
from . import views

urlpatterns = [
    path('run/', views.RunModelView.as_view(), name='run-model'),
    path('devices/', views.DeviceListView.as_view(), name="device-list"),
    path('logs/', views.LogListView.as_view(), name="log-list"),
]