from rest_framework.routers import DefaultRouter
from lorawan.api.urls import lorawan_router
from django.urls import path, include

router = DefaultRouter()
router.registry.extend(lorawan_router.registry)

urlpatterns = [
    path('', include(router.urls))
]