import pandas as pd

from django.contrib.auth.models import Group, User
from rest_framework import permissions, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from .isolationforest import runModel
from rest_framework.parsers import MultiPartParser
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, get_object_or_404
from django.template import loader
from .models import Node
from django.db.models import F
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.views import generic
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from lorawan.models import Node
from lorawan.serializers import NodeSerializer

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
        
@csrf_exempt 
def node_list(request):
    if request.method == "GET":
        nodes = Node.objects.all()
        serializer = NodeSerializer(nodes, many=True)
        return JsonResponse(serializer.data, safe=False)
        
    elif request.method == "POST":
        data = JSONParser().parse(request)
        serializer = NodeSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.errors, status=400)

@csrf_exempt
def node_detail(request, pk):
    try:
        node = Node.objects.get(pk=pk)
    except Node.DoesNotExist:
        return HttpResponse(status=404)
    
    if request.method == "GET":
        serializer = NodeSerializer(node)
        return JsonResponse(serializer.data)
    
    elif request.method == "PUT":
        data = JSONParser().parse(request)
        serializer = NodeSerializer(node, data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data)
        return JsonResponse(serializer.errors, status=400)
    
    elif request.method == "DELETE":
        node.delete()
        return HttpResponse(status=204)