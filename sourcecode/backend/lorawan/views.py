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
from .models import Node, Packet, MLModel, Anomaly, UserProfile
from .permissions import IsOwnerOrReadOnly
from .serializers import NodeSerializer, UserSerializer, PacketSerializer, MLModelSerializer, AnomalySerializer, UserProfileSerializer
from .services import mlmodel_service

@api_view(["GET"])
def api_root(request, format=None):
    return Response(
        {
            "users": reverse("lorawan:user-list", request=request, format=format),
            "nodes": reverse("lorawan:node-list", request=request, format=format),
            "packets": reverse("lorawan:packet-list", request=request, format = format),
            "mlmodels": reverse("lorawan:mlmodel-list", request=request, format = format),
            "anomalies": reverse("lorawan:anomaly-list", request=request, format=format),
            "userprofiles": reverse("lorawan:userprofile-list", request=request, format=format)
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

class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer

# Views
class TestView(APIView):
    def post(self, request):
        uploaded_file = request.FILES.get("myFile")
        df = pd.read_csv(uploaded_file)

        # Extract each of the columns, add them to DB
        column_names =[]
        for i in df.columns:
            column_names.append(i)

        first_row = df.iloc[0]

        nodeid = first_row.iloc[1]
        node = Node.objects.get(node_id=1)

        packet = Packet(
            nodeID=node, 
            mac=first_row.iloc[2],
            spreading_factor=first_row.iloc[3],
            channel_frequency=first_row.iloc[4],
            transmission_power=first_row.iloc[5],
            bandwidth=first_row.iloc[6],  
            coding_rate=first_row.iloc[7],
            snr=first_row.iloc[8],
            rssi=first_row.iloc[9],
            sequence_number=first_row.iloc[10],  
            payload=first_row.iloc[11],
            payload_size=first_row.iloc[12],
            num_recieved_per_node=first_row.iloc[13],
            pdr_per_node=first_row.iloc[14],
            current_seq_num=first_row.iloc[15],
            num_recieved_per_node_per_window=first_row.iloc[16],
            last_seq_num_at_window_start=first_row.iloc[17],
            pdr_per_node_per_window=first_row.iloc[18],
            inter_arrival_time_s=first_row.iloc[19],  
            inter_arrival_time_m=first_row.iloc[20]   
        )
        packet.save()

        return Response({"File": uploaded_file})
    
class RunModel(APIView):
    def post(self, request):
        uploaded_file = request.FILES.get('myFile')
        results = mlmodel_service.MLModelService.run(uploaded_file)

        return Response(results)
