from django.contrib.auth.models import Group, User
from rest_framework import serializers
from .models import UserProfile, Node, Packet, MLModel, Anomaly 

# User Profile?
# Node
# Packet
# Anomaly Detection

class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = "__all__"

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

    class Meta:
        model = Packet
        fields = "__all__"


class NodeSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source="owner.username")
    packets = PacketSerializer(source="packet_set", many=True, read_only=True)

    class Meta:
        model = Node
        fields = [
            "id",
            "owner", 
            "is_active", 
            "created_at", 
            "node_id",
            "packets"
        ]

class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    
    class Meta:
        model = UserProfile
        fields = ['username', 'email', 'role', 'organisation', 'profile_image']

class UserSerializer(serializers.ModelSerializer):
    nodes = NodeSerializer(many=True, read_only=True)
    userprofile = UserProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "email", "nodes", "userprofile"]

class MLModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = MLModel
        fields = "__all__"
