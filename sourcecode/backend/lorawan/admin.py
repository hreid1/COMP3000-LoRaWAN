from django.contrib import admin
from .models import UserProfile, Node, Packet

# Register your models here.
admin.site.register(UserProfile)
admin.site.register(Node)
admin.site.register(Packet)