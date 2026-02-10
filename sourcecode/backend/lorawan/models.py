from django.db import models
from django.contrib.auth.models import User
from pygments.lexers import get_lexer_by_name, get_all_lexers
from pygments.styles import get_all_styles
from pygments.formatters.html import HtmlFormatter
from pygments import highlight
from django.utils import timezone

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
    organisation = models.CharField(max_length=200)
    profile_image = models.ImageField(upload_to='profile_images/', null=True, blank=True)

    def __str__(self):
        return f"{self.user.username} UserProfile {self.id}"

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
    # Need to change time to time on dataset
    time = models.DateTimeField(null=True, blank=True)
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
    current_seq_num = models.IntegerField(default=0)
    last_seq_num_at_window_start = models.IntegerField()
    pdr_per_node_per_window = models.IntegerField()
    inter_arrival_time_s = models.FloatField()
    inter_arrival_time_m = models.FloatField()

    is_anomalous = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Packet {self.id} at {self.time}"

class MLModel(models.Model):
    name = models.CharField(max_length=200)
    version = models.FloatField()
    algorithm_type = models.CharField(max_length=100)
    created_by = models.ForeignKey(
        "auth.User", related_name="ml_models", on_delete=models.SET_NULL, null=True
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Model: {self.name} {self.version}"

class Anomaly(models.Model):
    packet = models.ForeignKey(Packet, on_delete=models.CASCADE)
    model = models.ForeignKey(MLModel, on_delete=models.CASCADE)
    detected_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Packet {self.packet_id} {self.model.name}:"

class ModelTrainingInfo(models.Model):
    model_id = models.ForeignKey(MLModel, on_delete=models.CASCADE)
    trained_by_id = models.ForeignKey("auth.User", on_delete=models.SET_NULL, null=True)
    trained_at = models.DateTimeField(null=True)
    training_data_file = models.CharField(max_length=100)
    num_training_samples = models.IntegerField()

    # Subject to change 
    contamination = models.FloatField()

    is_active = models.BooleanField(default=False)

    def __str__(self):
        return f"Model: {self.model_id.name} was trained at {self.trained_at}"

class ModelPredictionInfo(models.Model):
    model_id = models.ForeignKey(MLModel, on_delete=models.CASCADE)
    training_run_id = models.ForeignKey(ModelTrainingInfo, on_delete=models.CASCADE)
    predicted_at = models.DateField()
    input_file_name = models.CharField()
    num_packets = models.IntegerField()

    # Peformance Metrics
    anomalies_detected = models.IntegerField()
    anomaly_percentage = models.FloatField()
    mean_anomaly_score = models.FloatField()
    min_anomaly_score = models.FloatField()
    max_anomaly_score = models.FloatField()
    accuracy = models.FloatField()
    recall = models.FloatField()
    f1_score = models.FloatField()

    def __str__(self):
        return f"Model: {self.model_id.name} was ran on file {self.input_file_name} at {self.predicted_at}"
