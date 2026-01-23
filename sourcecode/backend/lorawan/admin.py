from django.contrib import admin
from .models import UserProfile, Node, Packet, MLModel, Anomaly

# Register your models here.
admin.site.register(UserProfile)
admin.site.register(Node)
admin.site.register(Packet)
admin.site.register(MLModel)
admin.site.register(Anomaly)