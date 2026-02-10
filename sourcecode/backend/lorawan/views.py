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
from .models import Node, Packet, MLModel, Anomaly, UserProfile, ModelPredictionInfo, ModelTrainingInfo
from .permissions import IsOwnerOrReadOnly
from .serializers import NodeSerializer, UserSerializer, PacketSerializer, MLModelSerializer, AnomalySerializer, UserProfileSerializer, ModelPredictionInfoSerailizer, ModelTrainingInfoSerializer
from .services import mlmodel_service
from rest_framework.pagination import PageNumberPagination

@api_view(["GET"])
def api_root(request, format=None):
    return Response(
        {
            "users": reverse("lorawan:user-list", request=request, format=format),
            "nodes": reverse("lorawan:node-list", request=request, format=format),
            "packets": reverse("lorawan:packet-list", request=request, format = format),
            "mlmodels": reverse("lorawan:mlmodel-list", request=request, format = format),
            "anomalies": reverse("lorawan:anomaly-list", request=request, format=format),
            "userprofiles": reverse("lorawan:userprofile-list", request=request, format=format),
            "modeltraininginfos": reverse("lorawan:modeltraininginfo-list", request=request, format=format),
            "modelpredictioninfos": reverse("lorawan:modelpredictioninfo-list", request=request, format=format)
        }
    )

class NodeViewSet(viewsets.ModelViewSet):
    queryset = Node.objects.all()
    serializer_class = NodeSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class PacketViewSet(viewsets.ModelViewSet):
    queryset = Packet.objects.all()
    serializer_class = PacketSerializer

class MLModelViewSet(viewsets.ModelViewSet):
    queryset = MLModel.objects.all()
    serializer_class = MLModelSerializer
    #permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        owner = User.objects.get(id=1)
        serializer.save(created_by=owner)
        #serializer.save(created_by=self.request.user)

class AnomalyViewSet(viewsets.ModelViewSet):
    queryset = Anomaly.objects.all().order_by("-detected_at")
    serializer_class = AnomalySerializer

class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer

class NodePacketsViewSet(viewsets.ModelViewSet):
    serializer_class = PacketSerializer
    
    def get_queryset(self):
        node_id = self.kwargs['node_id']
        return Packet.objects.filter(nodeID__node_id=node_id).order_by('-created_at')

class ModelTrainingInfoViewSet(viewsets.ModelViewSet):
    queryset = ModelTrainingInfo.objects.all() 
    serializer_class = ModelTrainingInfoSerializer

class ModelPredictionInfoViewSet(viewsets.ModelViewSet):
    queryset = ModelPredictionInfo.objects.all()
    serializer_class = ModelPredictionInfoSerailizer

# Views
class TestView(APIView):
    def post(self, request):
        uploaded_file = request.FILES.get("myFile")
        df = pd.read_csv(uploaded_file)

        owner = request.user if request.user.is_authenticated else User.objects.first()
        created_packets = []

        for idx, row in df.head(1000).iterrows():
        #for idx, row in df.iterrows():
            try:
                node_id = int(row.iloc[1])  # NodeID column

                node, _created = Node.objects.get_or_create(
                    node_id=node_id,
                    defaults={"owner": owner, "is_active": True},
                )

                packet = Packet(
                    time=pd.to_datetime(row.iloc[0]),
                    nodeID=node,
                    mac=row.iloc[2],
                    spreading_factor=int(row.iloc[3]),
                    channel_frequency=float(row.iloc[4]),
                    transmission_power=int(row.iloc[5]),
                    bandwidth=int(row.iloc[6]),
                    coding_rate=int(row.iloc[7]),
                    snr=float(row.iloc[8]),
                    rssi=float(row.iloc[9]),
                    sequence_number=int(row.iloc[10]),
                    payload=row.iloc[11],
                    payload_size=int(row.iloc[12]),
                    num_recieved_per_node=int(row.iloc[13]),
                    pdr_per_node=int(row.iloc[14]),
                    current_seq_num=int(row.iloc[15]),
                    num_recieved_per_node_per_window=int(row.iloc[16]),
                    last_seq_num_at_window_start=int(row.iloc[17]),
                    pdr_per_node_per_window=int(row.iloc[18]),
                    inter_arrival_time_s=float(row.iloc[19]),
                    inter_arrival_time_m=float(row.iloc[20]),
                )
                packet.save()
                created_packets.append(packet.id)
            except Exception as e:
                return Response({"error": f"Row {idx}: {str(e)}"}, status=400)

        return Response({
            "message": f"Successfully created {len(created_packets)} packets",
            "packet_ids": created_packets
        })
    
class RunModel(APIView):
    def post(self, request):
        uploaded_file = request.FILES.get('myFile')
        model_type = request.POST.get('model', 'IsolationForest') 
        results = mlmodel_service.MLModelService.run(uploaded_file, model_type)

        return Response(results)
