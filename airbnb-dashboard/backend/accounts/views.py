from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAdminUser
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import UserSerializer, CustomTokenObtainPairSerializer, UserListSerializer

User = get_user_model()

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = UserSerializer

class UserListView(generics.ListAPIView):
    queryset = User.objects.all().order_by('-date_joined')
    permission_classes = (IsAdminUser,)
    serializer_class = UserListSerializer

class UserDetailView(generics.DestroyAPIView):
    queryset = User.objects.all()
    permission_classes = (IsAdminUser,)

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

class UserMeView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        serializer = UserListSerializer(request.user)
        return Response(serializer.data)
