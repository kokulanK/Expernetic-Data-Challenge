from rest_framework import serializers
from .models import ChatHistory

class ChatHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatHistory
        fields = '__all__'
        read_only_fields = ('user', 'answer', 'created_at')
