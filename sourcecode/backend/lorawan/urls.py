from django.urls import path
from .views import RunModelView

urlpatterns = [
    path('run-model/', RunModelView.as_view(), name='run-model'),
]