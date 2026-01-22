import pandas as pd

from lorawan.models import Node
from lorawan.serializers import NodeSerializer
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
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
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from lorawan.models import Node
from lorawan.serializers import NodeSerializer, UserSerializer
from rest_framework import generics
from django.contrib.auth.models import User
from rest_framework import permissions
from lorawan.permissions import IsOwnerOrReadOnly
from rest_framework.response import Response
from rest_framework.reverse import reverse
from rest_framework import viewsets
from rest_framework.decorators import action

@api_view(["GET"])
def api_root(request, format=None):
    return Response(
        {
            "users": reverse("lorawan:user-list", request=request, format=format),
            "nodes": reverse("lorawan:node-list", request=request, format=format)
        }
    )

class NodeViewSet(viewsets.ModelViewSet):
    queryset = Node.objects.all()
    serializer_class = NodeSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

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
        