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
    owner = models.ForeignKey(
        "auth.User", related_name="packets", on_delete=models.SET_NULL, null=True
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Packet {self.id} at {self.time}"

class MLModel(models.Model):
    name = models.CharField(max_length=200)
    version = models.FloatField()
    algorithm_type = models.CharField(max_length=100)
    owner = models.ForeignKey(
        "auth.User", related_name="ml_models", on_delete=models.SET_NULL, null=True
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Model: {self.name} {self.version}"

class Anomaly(models.Model):
    packet = models.ForeignKey(Packet, on_delete=models.CASCADE)
    model = models.ForeignKey(MLModel, on_delete=models.CASCADE)
    #detected_at = models.DateTimeField(auto_now_add=True)
    detected_at = models.DateTimeField(default=timezone.now)
    anomaly_score = models.FloatField(null=True, blank=True)
    owner = models.ForeignKey(
        "auth.User", related_name="anomalies", on_delete=models.SET_NULL, null=True
    )

    def __str__(self):
        return f"Packet {self.packet_id} {self.model.name}:"

class ModelTrainingInfo(models.Model):
    model_id = models.ForeignKey(MLModel, on_delete=models.CASCADE)
    trained_at = models.DateTimeField(null=True)
    training_data_file = models.CharField(max_length=100)
    num_training_samples = models.IntegerField()

    # Subject to change 
    contamination = models.FloatField()

    is_active = models.BooleanField(default=False)

    owner = models.ForeignKey(
        "auth.User", related_name="modeltraininginfos", on_delete=models.SET_NULL, null=True
    )

    def __str__(self):
        return f"Model: {self.model_id.name} was trained at {self.trained_at}"

class ModelPredictionInfo(models.Model):
    model_id = models.ForeignKey(MLModel, on_delete=models.CASCADE)
    training_run_id = models.ForeignKey(ModelTrainingInfo, on_delete=models.CASCADE, null=True, blank=True)
    predicted_at = models.DateTimeField(auto_now_add=True)
    input_file_name = models.CharField(max_length=255)
    num_packets = models.IntegerField()

    # Performance Metrics
    anomalies_detected = models.IntegerField()
    anomaly_percentage = models.FloatField()
    silhouette_score = models.FloatField(null=True, blank=True)
    mean_anomaly_score = models.FloatField()
    std_anomaly_score = models.FloatField(null=True, blank=True)
    min_anomaly_score = models.FloatField()
    max_anomaly_score = models.FloatField()
    accuracy = models.FloatField(null=True, blank=True)
    precision = models.FloatField(null=True, blank=True)
    recall = models.FloatField(null=True, blank=True)
    f1_score = models.FloatField(null=True, blank=True)

    owner = models.ForeignKey(
    "auth.User", related_name="modelpredictioninfos", on_delete=models.SET_NULL, null=True
    )

    def __str__(self):
        return f"Model: {self.model_id.name} was ran on file {self.input_file_name} at {self.predicted_at}"


class Alert(models.Model):
    SEVERITY_CHOICES = [
        ("success", "Success"),
        ("info", "Info"),
        ("warning", "Warning"),
        ("error", "Error"),
    ]
    
    ALERT_TYPE_CHOICES = [
        ('anomaly', 'Anomaly'),
        ('system', 'System'),
    ]

    owner = models.ForeignKey(
        "auth.User", related_name="alerts", on_delete=models.CASCADE
    )
    title = models.CharField(max_length=200)
    message = models.CharField(max_length=500)
    alert_type = models.CharField(max_length=20, choices=ALERT_TYPE_CHOICES, default='system')
    severity = models.CharField(max_length=20, choices=SEVERITY_CHOICES, default='medium')

    node = models.ForeignKey(Node, on_delete=models.SET_NULL, null=True, blank=True)
    packet = models.ForeignKey(Packet, on_delete=models.SET_NULL, null=True, blank=True)
    anomaly = models.ForeignKey(Anomaly, on_delete=models.SET_NULL, null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    is_resolved = models.BooleanField(default=False)
    resolved_by = models.ForeignKey(
        "auth.User", related_name='resolved_alerts', on_delete=models.SET_NULL, null=True, blank=True
    )
    resolved_at = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"Alert: {self.title} ({self.severity})"

class Log(models.Model):
    LOG_TYPE_CHOICES = [
        ("model_run", "Model Run"),
        ("anomaly_detected", "Anomaly Detected"),
        ("device_added", "Device Added"),
        ("device_removed", "Device Removed"),
        ("device_status_change", "Device Status Change"),
    ]

    SEVERITY_CHOICES = [
        ("success", "Success"),
        ("info", "Info"),
        ("warning", "Warning"),
        ("error", "Error"),
    ]
    owner = models.ForeignKey(
        "auth.User", related_name="logs", on_delete=models.CASCADE
    )
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    log_type = models.CharField(max_length=20, choices=LOG_TYPE_CHOICES)
    severity = models.CharField(max_length=20, choices=SEVERITY_CHOICES, default="info")

    node = models.ForeignKey(Node, on_delete=models.SET_NULL, null=True, blank=True)
    packet = models.ForeignKey(Packet, on_delete=models.SET_NULL, null=True, blank=True)
    anomaly = models.ForeignKey(Anomaly, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)

    def __str__(self):
        return f"Log: {self.title}"

class Announcement(models.Model):
    MODEL_TYPE_CHOICES = [
        ("system", "System")
    ]

