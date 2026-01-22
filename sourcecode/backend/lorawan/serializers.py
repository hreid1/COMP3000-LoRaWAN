from django.contrib.auth.models import Group, User
from rest_framework import serializers
from .models import UserProfile, Node, Packet, AnomalyDetection

# User Profile?
# Node
# Packet
# Anomaly Detection

class UserSerializer(serializers.ModelSerializer):
    nodes = serializers.PrimaryKeyRelatedField(many=True, queryset=Node.objects.all())

    class Meta:
        model = User
        fields = ["id", "username", "nodes"]

class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ["url", "name"]

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

class PacketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Packet
        fields = "__all__"

class AnomalyDetectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnomalyDetection
        fields = "__all__"