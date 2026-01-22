from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.urlpatterns import format_suffix_patterns
from rest_framework import renderers
from lorawan.views import api_root, NodeViewSet, UserViewSet
from . import views

router = DefaultRouter()
router.register(r"nodes", views.NodeViewSet, basename="node")
router.register(r"users", views.UserViewSet, basename="user")

app_name = "lorawan"
urlpatterns = [
    path("", include(router.urls)),

    path('run/', views.RunModelView.as_view(), name='run-model'),
    path('devices/', views.DeviceListView.as_view(), name="device-list"),
    path('logs/', views.LogListView.as_view(), name="log-list"),
]
