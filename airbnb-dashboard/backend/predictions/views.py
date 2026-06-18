import os
import re
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from gradio_client import Client
from .models import Prediction
from .serializers import PredictionSerializer

class PredictionViewSet(viewsets.ModelViewSet):
    queryset = Prediction.objects.all()
    serializer_class = PredictionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Extract validated fields
        data = serializer.validated_data
        
        try:
            client = Client("kokulan123/airbnb-price-predictor")
            result = client.predict(
                city=data.get("city", "London"),
                room_type=data.get("room_type", "Entire home/apt"),
                property_type=data.get("property_type", "Apartment"),
                accommodates=float(data.get("accommodates", 2)),
                bedrooms=float(data.get("bedrooms", 1)),
                bathrooms=float(data.get("bathrooms", 1.0)),
                beds=float(data.get("beds", 1)),
                minimum_nights=float(data.get("minimum_nights", 1)),
                availability_365=float(data.get("availability_365", 180)),
                number_of_reviews=float(data.get("number_of_reviews", 10)),
                review_scores_rating=float(data.get("review_scores_rating", 4.5)),
                host_portfolio_type=data.get("host_portfolio_type", "Single listing"),
                api_name="/predict_price"
            )
            
            # Extract float from string (e.g. "$175.24 per night" or "£125.50 per night")
            match = re.search(r"[\d\.]+", str(result))
            if match:
                predicted_price = float(match.group())
            else:
                predicted_price = 125.50
        except Exception as e:
            print("Error running HF Gradio Client prediction:", e)
            predicted_price = 125.50
            
        prediction = serializer.save(user=request.user, predicted_price=predicted_price)
        
        return Response(PredictionSerializer(prediction).data, status=status.HTTP_201_CREATED)

