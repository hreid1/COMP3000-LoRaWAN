import pandas as pd
from django.contrib.auth.models import User
from django.urls import reverse
from django.views import generic
from rest_framework import permissions, viewsets
from rest_framework.decorators import api_view
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from rest_framework.reverse import reverse
from rest_framework.views import APIView
from .isolationforest import runModel
from .models import Node, Packet, MLModel, Anomaly
from .permissions import IsOwnerOrReadOnly
from .serializers import NodeSerializer, UserSerializer, PacketSerializer, MLModelSerializer, AnomalySerializer

@api_view(["GET"])
def api_root(request, format=None):
    return Response(
        {
            "users": reverse("lorawan:user-list", request=request, format=format),
            "nodes": reverse("lorawan:node-list", request=request, format=format),
            "packets": reverse("lorawan:packet-list", request=request, format = format),
            "mlmodels": reverse("lorawan:mlmodel-list", request=request, format = format),
            "anomalies": reverse("lorawan:anomaly-list", request=request, format=format),
        }
    )

class NodeViewSet(viewsets.ModelViewSet):
    queryset = Node.objects.all()
    serializer_class = NodeSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class PacketViewSet(viewsets.ModelViewSet):
    queryset = Packet.objects.all()
    serializer_class = PacketSerializer

class MLModelViewSet(viewsets.ModelViewSet):
    queryset = MLModel.objects.all()
    serializer_class = MLModelSerializer

class AnomalyViewSet(viewsets.ModelViewSet):
    queryset = Anomaly.objects.all()
    serializer_class = AnomalySerializer

class DetailView(generic.DetailView):
    model = Node
    template_name = "lorawan/detail.html"
    
class DeviceListView(APIView):
    def get(self, request):
        return Response({"devices": []})

class LogListView(APIView):
    def get(self, request):
        return Response({"logs": []})

class RunModelView(APIView):
    parser_classes = [MultiPartParser]

    def post(self, request):
        try:
            uploaded_file = request.FILES.get("file")
            if uploaded_file:
                df = pd.read_csv(uploaded_file)
                results = runModel(df)
            else:
                results = runModel()
            return Response(results, status=200)
        except Exception as e:
            return Response({"error": str(e)}, status=500)
