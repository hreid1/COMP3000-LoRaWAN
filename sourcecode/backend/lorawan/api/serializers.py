from rest_framework.serializers import ModelSerializer
from ..models import Lorawan

class LorawanSerializer(ModelSerializer):
    class Meta:
        model = Lorawan
        fields = ('id', 'title', 'body')