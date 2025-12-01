from rest_framework.viewsets import ModelViewSet
from ..models import Lorawan
from .serializers import LorawanSerializer

class LorawanViewSet(ModelViewSet):
    queryset = Lorawan.objects.all()
    serializer_class = LorawanSerializer