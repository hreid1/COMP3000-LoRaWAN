from django.contrib.auth.models import Group, User
from rest_framework import serializers
from .models import UserProfile, Node, Packet, MLModel, Anomaly 

# User Profile?
# Node
# Packet
# Anomaly Detection

class UserSerializer(serializers.ModelSerializer):
    nodes = serializers.PrimaryKeyRelatedField(many=True, queryset=Node.objects.all())

    class Meta:
        model = User
        fields = ["id", "username", "email", "nodes"]

class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = "__all__"

class NodeSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source="owner.username")

    class Meta:
        model = Node
        fields = [
            "id",
            "owner", 
            "is_active", 
            "created_at", 
            "node_id",
        ]

class AnomalySerializer(serializers.ModelSerializer):
    model_name = serializers.ReadOnlyField(source="model.name")
    packet_sequence = serializers.ReadOnlyField(source='packet_id.sequence_number')

    class Meta:
        model = Anomaly
        fields = ["id", "packet_id", "packet_sequence", "model", "model_name", "is_anomaly", "detected_at"]

class PacketSerializer(serializers.ModelSerializer):
    time = serializers.DateTimeField(
        input_formats=['%Y-%m-%d %H:%M:%S', '%Y-%m-%dT%H:%M:%S', 'iso-8601']
    )
    anomaly_detections = AnomalySerializer(source="anomaly_set", many=True, read_only=True)

    class Meta:
        model = Packet
        fields = "__all__"

class MLModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = MLModel
        fields = "__all__"
