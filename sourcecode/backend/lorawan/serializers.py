from django.contrib.auth.models import Group, User
from rest_framework import serializers
from .models import UserProfile, Node, Packet, AnomalyDetection

# User Profile?
# Node
# Packet
# Anomaly Detection

class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ["url", "username", "email", "groups"]


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ["url", "name"]

class NodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Node
        fields = "__all__"

class PacketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Packet
        fields = "__all__"

class AnomalyDetectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnomalyDetection
        fields = "__all__"