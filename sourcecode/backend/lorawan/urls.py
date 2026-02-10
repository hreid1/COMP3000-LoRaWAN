from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.urlpatterns import format_suffix_patterns
from rest_framework import renderers
from lorawan.views import api_root, NodeViewSet, UserViewSet, PacketViewSet, MLModelViewSet, AnomalyViewSet, TestView
from . import views

router = DefaultRouter()
router.register(r"nodes", views.NodeViewSet, basename="node")
router.register(r"users", views.UserViewSet, basename="user")
router.register(r"packets", views.PacketViewSet, basename="packet")
router.register(r"mlmodels", views.MLModelViewSet, basename="mlmodel")
router.register(r"anomaly", views.AnomalyViewSet, basename="anomaly")
router.register(r"userprofiles", views.UserProfileViewSet, basename="userprofiles")
router.register(r"modeltraininginfos", views.ModelTrainingInfoViewSet, basename="modeltraininginfo")
router.register(r"modelpredictioninfos", views.ModelPredictionInfoViewSet, basename="modelpredictioninfo")

app_name = "lorawan"
urlpatterns = [
    path("", include(router.urls)),

    path("run/", views.RunModel.as_view(), name='run-model'),
    path("addmodel/", views.TestView.as_view(), name='add')
]
