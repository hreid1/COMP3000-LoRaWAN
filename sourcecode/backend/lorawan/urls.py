from django.urls import path
from .views import RunModelView

urlpatterns = [
    path('run/', RunModelView.as_view(), name='run-model'),
]