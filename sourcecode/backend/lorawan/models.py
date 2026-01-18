from django.db import models

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

class Node(models.Model):
   owner = models.CharField(max_length=200)

class Packet(models.Model):
    time = models.DateTimeField()
    nodeID = models.ForeignKey(Node, on_delete=models.CASCADE)

