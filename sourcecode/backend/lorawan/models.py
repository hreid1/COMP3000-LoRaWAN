from django.db import models
from django.contrib.auth.models import User
from pygments.lexers import get_lexer_by_name, get_all_lexers
from pygments.styles import get_all_styles
from pygments.formatters.html import HtmlFormatter
from pygments import highlight

# Packet
    # Time: UTC
    # NodeID: Integer
    # MAC: string
    # SF (Spreading Factor): Integer
    # CF (Channel Frequency): Floating point
    # TX (Transmission Power): Integer
    # BW (Bandwidth): Integer
    # CR (Coding Rate): Integer
    # SNR (Singal to noise ratio): Floating point
    # RSSI (Recieve Signal Strength Indicator): Floating Point
    # PktSeqNum: Integer
    # payload: Character
    # payloadSize: Integer
    # numReceivedPerNode[nodeNumber-1]: Integer
    # PDRPerNode: Integer
    # numReceivedPerNodePerWindow[nodeNumber]
    # currentSeqNum: Integer
    # lastSeqNumAtWindowStart[nodeNumber]: Integer
    # pdrPerNodePerWindow[nodeNumber]: Integer
    # interArrivalTime_s: Floating point
    # interArrivalTimeMin: Floating point
# Node / device

# Create your models here.
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=50)
    origanisation = models.CharField(max_length=200)

class Node(models.Model):
    # FK
    owner = models.ForeignKey(
        "auth.User", related_name="nodes", on_delete=models.CASCADE
    )

    node_id = models.IntegerField(unique=True)

    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField()

    def __str__(self):
        return f"Node {self.node_id}"

class Packet(models.Model):
    time = models.DateTimeField(auto_now_add=True)

    # FK
    nodeID = models.ForeignKey(Node, on_delete=models.CASCADE)

    mac = models.CharField(max_length=6)
    spreading_factor = models.IntegerField()
    channel_frequency = models.FloatField()
    transmission_power = models.IntegerField()
    bandwidth = models.IntegerField()
    coding_rate = models.IntegerField()
    snr = models.FloatField()
    rssi = models.FloatField()
    sequence_number = models.IntegerField()
    payload = models.CharField(max_length=20)
    payload_size = models.IntegerField()
    num_recieved_per_node = models.IntegerField()
    pdr_per_node = models.IntegerField()
    num_recieved_per_node_per_window = models.IntegerField()
    last_seq_num_at_window_start = models.IntegerField()
    pdr_per_node_per_window = models.IntegerField()
    inter_arrival_time_s = models.FloatField()
    inter_arrival_time_m = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Packet {self.sequence_number} at {self.time}"

class MLModel(models.Model):
    name = models.CharField()
    version = models.FloatField()
    algorithm_type = models.CharField()

    def __str__(self):
        return f"Model: {self.name} {self.version}"

class Anomaly(models.Model):
    # FK
    packet_id = models.ForeignKey(Packet, on_delete=models.CASCADE)
    model = models.ForeignKey(MLModel, on_delete=models.CASCADE)

    is_anomaly = models.BooleanField()
    detected_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Packet {self.packet_id}"

    
