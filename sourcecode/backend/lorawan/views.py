import pandas as pd

from django.contrib.auth.models import Group, User
from rest_framework import permissions, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from .isolationforest import runModel
from rest_framework.parsers import MultiPartParser
from django.http import HttpResponse
from django.shortcuts import render, get_object_or_404
from django.template import loader
from .models import Node
from django.db.models import F
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.views import generic

class IndexView(generic.ListView):
    template_name = "lorawan/index.html"
    context_object_name = "node_list"

    def get_queryset(self):
        return Node.objects.order_by("id")[:5]

class DetailView(generic.DetailView):
    model = Node
    template_name = "lorawan/detail.html"
    
class DeviceListView(APIView):
    def get(self, request):
        return Response({"devices": []})

class LogListView(APIView):
    def get(self, request):
        return Response({"logs": []})

class RunModelView(APIView):
    parser_classes = [MultiPartParser]

    def post(self, request):
        try:
            uploaded_file = request.FILES.get("file")
            if uploaded_file:
                df = pd.read_csv(uploaded_file)
                results = runModel(df)
            else:
                results = runModel()
            return Response(results, status=200)
        except Exception as e:
            return Response({"error": str(e)}, status=500)
        