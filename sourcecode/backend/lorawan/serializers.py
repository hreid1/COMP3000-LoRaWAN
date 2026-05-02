from django.contrib.auth.models import Group, User
from rest_framework import serializers
from .models import UserProfile, Node, Packet, MLModel, Anomaly, ModelPredictionInfo, ModelTrainingInfo, Alert, Log
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

# User Profile?
# Node
# Packet
# Anomaly Detection

class PacketPagination(PageNumberPagination):
    page_size = 100

class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = "__all__"

class LogSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source="owner.username")
    class Meta:
        model = Log
        fields = "__all__"

class PacketSerializer(serializers.ModelSerializer):
    time = serializers.DateTimeField(
        input_formats=['%Y-%m-%d %H:%M:%S', '%Y-%m-%dT%H:%M:%S', 'iso-8601']
    )

    class Meta:
        model = Packet
        fields = "__all__"

class AnomalySerializer(serializers.ModelSerializer):
    model_name = serializers.ReadOnlyField(source="model.name")
    packet = PacketSerializer(read_only=True)

    class Meta:
        model = Anomaly
        #fields = "__all__"
        fields = ["id", "model_name", "detected_at", "packet", "anomaly_score"]

class NodeSerializer(serializers.ModelSerializer):
    #owner = serializers.ReadOnlyField(source="owner.username")
    packets_count = serializers.SerializerMethodField()

    class Meta:
        model = Node
        fields = [
            "id",
            "owner", 
            "is_active", 
            "created_at", 
            "node_id",
            "packets_count"
        ]
        read_only_fields = ['owner', 'created_at']

    def get_packets_count(self, obj):
        return obj.packet_set.count()


class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    
    class Meta:
        model = UserProfile
        fields = ['username', 'email', 'role', 'organisation', 'profile_image']

class AlertSerializer(serializers.ModelSerializer):
    class Meta:
        model = Alert
        fields = ['id', 'title', 'message', 'alert_type', 'severity', 'created_at']
        read_only_fields = ['id', 'created_at', 'owner']

class MLModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = MLModel
        fields = ['id', 'name', 'version', 'algorithm_type', 'owner', 'created_at']

class ModelTrainingInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ModelTrainingInfo
        fields = "__all__"

class ModelPredictionInfoSerailizer(serializers.ModelSerializer):
    class Meta:
        model = ModelPredictionInfo
        fields = "__all__"

class UserSerializer(serializers.ModelSerializer):
    nodes = NodeSerializer(many=True, read_only=True)
    userprofile = UserProfileSerializer(read_only=True)
    alerts = AlertSerializer(many=True, read_only=True)
    anomalies = AnomalySerializer(many=True, read_only=True)
    logs = LogSerializer(many=True, read_only=True)
    modeltraininginfos = ModelTrainingInfoSerializer(many=True, read_only=True)
    modelpredictioninfos = ModelPredictionInfoSerailizer(many=True, read_only=True) 

    class Meta:
        model = User
        fields = [
            "id", 
            "username",
            "email", 
            "userprofile", 
            "alerts", 
            "anomalies", 
            "modeltraininginfos", 
            "modelpredictioninfos",
            "logs",
            "nodes", 
        ]
