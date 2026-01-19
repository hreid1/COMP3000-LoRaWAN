from django.urls import path
from . import views

app_name = "lorawan"
urlpatterns = [
    path("", views.IndexView.as_view(), name="index"),
    path("<int:pk>/", views.DetailView.as_view(), name="detail"),

    path('run/', views.RunModelView.as_view(), name='run-model'),
    path('devices/', views.DeviceListView.as_view(), name="device-list"),
    path('logs/', views.LogListView.as_view(), name="log-list"),
]