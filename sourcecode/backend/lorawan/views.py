import pandas as pd
from django.contrib.auth.models import User
from django.urls import reverse
from django.views import generic
from django.utils import timezone
from rest_framework import permissions, viewsets
from rest_framework.decorators import api_view
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from rest_framework.reverse import reverse
from rest_framework.views import APIView
from .models import Node, Packet, MLModel, Anomaly, UserProfile, ModelPredictionInfo, ModelTrainingInfo, Alert, Log
from .permissions import IsOwnerOrReadOnly
from .serializers import NodeSerializer, UserSerializer, PacketSerializer, MLModelSerializer, AnomalySerializer, UserProfileSerializer, ModelPredictionInfoSerailizer, ModelTrainingInfoSerializer, AlertSerializer, LogSerializer, PacketPagination
from .services import mlmodel_service
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import AllowAny
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt 
from django.shortcuts import render
import joblib
import numpy as np
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from .services.mlmodel_service import MLModelService
from django_filters.rest_framework import DjangoFilterBackend

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
            "modelpredictioninfos": reverse("lorawan:modelpredictioninfo-list", request=request, format=format),
            "alerts": reverse("lorawan:alert-list", request=request, format=format),
            "logs": reverse("lorawan:log-list", request=request, format=format)

        }
    )

@api_view(["POST"])
def train_models(request):
    """Train and save ML models"""
    try:
        isolationforest, localoutlierfactor = MLModelService.trainModels()
        return Response({
            "success": True,
            "message": "Models trained successfully",
            "models": ["Isolation Forest", "Local Outlier Factor"]
        })
    except Exception as e:
        return Response({
            "success": False,
            "error": str(e)
        }, status=400)

class NodeViewSet(viewsets.ModelViewSet):
    queryset = Node.objects.all()
    serializer_class = NodeSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
    pagination_class = PacketPagination

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    @action(detail=False, methods=['get'])
    def me(self, request):
        if request.user.is_authenticated:
            serializer = self.get_serializer(request.user)
            return Response(serializer.data)
        return Response({"detail": "Not authenticated"}, status=401)

class PacketViewSet(viewsets.ModelViewSet):
    queryset = Packet.objects.all()
    serializer_class = PacketSerializer
    pagination_class = PacketPagination

class MLModelViewSet(viewsets.ModelViewSet):
    queryset = MLModel.objects.all()
    serializer_class = MLModelSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class AnomalyViewSet(viewsets.ModelViewSet):
    queryset = Anomaly.objects.all()
    serializer_class = AnomalySerializer
    filter_backends = [DjangoFilterBackend]
    filtersetFields = ['model_name']

class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer

class NodePacketsViewSet(viewsets.ModelViewSet):
    serializer_class = PacketSerializer
    pagination_class = PacketPagination
    
    def get_queryset(self):
        node_id = self.kwargs['node_id']
        return Packet.objects.filter(nodeID__node_id=node_id).order_by('-created_at')

class ModelTrainingInfoViewSet(viewsets.ModelViewSet):
    queryset = ModelTrainingInfo.objects.all() 
    serializer_class = ModelTrainingInfoSerializer

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class ModelPredictionInfoViewSet(viewsets.ModelViewSet):
    queryset = ModelPredictionInfo.objects.all()
    serializer_class = ModelPredictionInfoSerailizer

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class AlertViewSet(viewsets.ModelViewSet):
    serializer_class = AlertSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return Alert.objects.all()
    
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class LogViewSet(viewsets.ModelViewSet):
    serializer_class = LogSerializer
    pagination_class = PacketPagination

    def get_queryset(self):
        return Log.objects.all()
    
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

# Views
class RunModel(APIView):
    parser_classes = (MultiPartParser,)
    permission_classes = [permissions.IsAuthenticated]
    
    def createPacketsFromDataframe(self, df, owner):
        created_packets = []
        
        for idx, row in df.head(1000).iterrows():
            try:
                node_id = int(row.iloc[1])  # NodeID column

                node, _created = Node.objects.get_or_create(
                    node_id=node_id,
                    defaults={"owner": owner, "is_active": True},
                )

                packet = Packet(
                    time=timezone.make_aware(pd.to_datetime(row.iloc[0])),
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
                raise Exception(f"Row {idx}: {str(e)}")
        
        return created_packets
    
    def post(self, request):
        uploaded_file = request.FILES.get('myFile')
        model_type = request.POST.get('model', 'IsolationForest')
        
        if not uploaded_file:
            return Response({"error": "No file provided"}, status=400)
        
        # Run model to get predictions and performance metrics
        try:
            results = mlmodel_service.MLModelService.run(uploaded_file, model_type)
        except Exception as e:
            return Response({"error": f"Model execution failed: {str(e)}"}, status=400)
        
        # Re-read file to create packets (necessary because file pointer was consumed)
        uploaded_file.seek(0)
        try:
            df = pd.read_csv(uploaded_file)
        except Exception as e:
            return Response({"error": f"Invalid CSV file: {str(e)}"}, status=400)
        
        # Create packet records
        try:
            created_packets = self.createPacketsFromDataframe(df, request.user)
        except Exception as e:
            return Response({"error": str(e)}, status=400)

        # Get or create the MLModel instance
        ml_model, _ = MLModel.objects.get_or_create(
            algorithm_type=model_type,
            defaults={
                'name': results['model info']['model'],
                'version': 1.0,
                'owner': request.user
            }
        )

        # Get the active training run or None
        training_run = ModelTrainingInfo.objects.filter(
            model_id=ml_model, 
            is_active=True
        ).first()

        # Extract performance metrics
        performance = results['performance']
        supervised = performance.get('supervised_metrics', {})
        anomaly_scores = performance.get('anomaly_scores', {})

        # Create ModelPredictionInfo entry
        prediction_info = ModelPredictionInfo.objects.create(
            model_id=ml_model,
            training_run_id=training_run,
            input_file_name=results['file name'],
            num_packets=results['num_packets'],
            anomalies_detected=performance['anomaly_count'],
            anomaly_percentage=performance['anomaly_percentage'],
            silhouette_score=performance.get('silhouette_score'),
            mean_anomaly_score=anomaly_scores.get('mean'),
            std_anomaly_score=anomaly_scores.get('std'),
            min_anomaly_score=anomaly_scores.get('min'),
            max_anomaly_score=anomaly_scores.get('max'),
            accuracy=supervised.get('accuracy'),
            precision=supervised.get('precision'),
            recall=supervised.get('recall'),
            f1_score=supervised.get('f1_score'),
            owner=request.user
        )

        # Add prediction info ID to results
        results['prediction_id'] = prediction_info.id

        # Create anomaly records for flagged packets
        created_anomalies = []  # Track created anomalies for alert creation -> used because multiple models can pick a singular packet to be anomalous so get doesnt work
        if 'anomaly_indices' in results and results['anomaly_indices']:
            # Get packet IDs from the latest packets (assuming uploaded file packets were just created)
            recent_packets = list(Packet.objects.filter(id__in=created_packets).order_by('created_at').values_list('id', flat=True))
            
            anomaly_count = 0
            for idx, anomaly_score in zip(results['anomaly_indices'], results['anomaly_scores']):
                try:
                    if idx < len(recent_packets):
                        packet_id = recent_packets[idx]
                        anomaly = Anomaly.objects.create(
                            packet_id=packet_id,
                            model=ml_model,
                            anomaly_score=float(anomaly_score),
                            owner=request.user
                        )
                        created_anomalies.append(anomaly)
                        anomaly_count += 1
                except Exception as e:
                    print(f"Error creating anomaly record: {str(e)}")
            
            results['anomalies_created'] = anomaly_count
            # Also mark packets as anomalous in the Packet model
            Packet.objects.filter(id__in=[recent_packets[i] for i in results['anomaly_indices'] if i < len(recent_packets)]).update(is_anomalous=True)

        # Create alerts for each anomaly
        for anomaly in created_anomalies:
            try:
                packet = anomaly.packet

                Alert.objects.create(
                    owner=request.user,
                    title=f"Anomaly Detected at {packet.nodeID}",
                    message=f"Anomaly packet {packet.id} flagged by Model: {ml_model.name}",
                    alert_type='anomaly',
                    node=packet.nodeID,
                    packet=packet,
                    anomaly=anomaly,
                    severity='warning'
                )
                    
            except Exception as e:
                print(f"Error creating alert record: {str(e)}") 

        # Create log
        try:
            Log.objects.create(
                owner=request.user,
                title=f"Model Run: {ml_model.name}",
                description=(
                    f"A total of {performance['anomaly_count']} anomalies were found from file '{results['file name']}'"
                ),
                log_type='model_run',
                severity='info',
            )
        except Exception as e:
            print(f"Error creating lot: {str(e)}")


        return Response(results)
