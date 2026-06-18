import os
import requests
import json
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import ChatHistory
from .serializers import ChatHistorySerializer

class ChatHistoryViewSet(viewsets.ModelViewSet):
    queryset = ChatHistory.objects.all()
    serializer_class = ChatHistorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user).order_by('-created_at')

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        question = serializer.validated_data['question']

        groq_api_key = os.environ.get('GROQ_API_KEY', '')
        
        system_prompt = """You are an Airbnb data expert assistant. You only answer questions about Airbnb pricing, hosting, occupancy, analytics, and rental optimization.
If the question is unrelated, you MUST return exactly this JSON and nothing else:
{
  "error": "OUT_OF_SCOPE",
  "message": "I only answer Airbnb analytics questions"
}"""
        
        headers = {
            "Authorization": f"Bearer {groq_api_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": "llama-3.1-8b-instant",
            "messages": [
                {"role": "system", "content": "You are an Airbnb data expert assistant. You only answer questions about Airbnb pricing, hosting, occupancy, analytics, and rental optimization.\nIf the question is unrelated, you MUST return exactly this JSON and nothing else:\n{\n  \"error\": \"OUT_OF_SCOPE\",\n  \"message\": \"I only answer Airbnb analytics questions\"\n}"},
                {"role": "user", "content": question}
            ]
        }
        
        try:
            if not groq_api_key:
                answer = "This is a mocked response because GROQ_API_KEY is not set in .env."
            else:
                response = requests.post("https://api.groq.com/openai/v1/chat/completions", headers=headers, json=payload)
                response.raise_for_status()
                answer = response.json()['choices'][0]['message']['content']
                
            if 'OUT_OF_SCOPE' in answer:
                try:
                    parsed = json.loads(answer)
                    return Response(parsed, status=status.HTTP_400_BAD_REQUEST)
                except Exception:
                    # Fallback if the LLM returned extra text around the JSON
                    return Response({"error": "OUT_OF_SCOPE", "message": "I only answer Airbnb analytics questions"}, status=status.HTTP_400_BAD_REQUEST)
                
        except Exception as e:
            answer = f"Error processing request: {str(e)}"
            
        chat = serializer.save(user=request.user, answer=answer)
        return Response(ChatHistorySerializer(chat).data, status=status.HTTP_201_CREATED)
