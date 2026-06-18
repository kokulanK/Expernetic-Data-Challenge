import random
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from datetime import datetime, timedelta

class StreamingSimView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Simulate real-time price monitoring and alerting
        # In a real app this would be WebSockets or SSE
        
        alerts = []
        cities = ["London", "New York"]
        
        for _ in range(5):
            city = random.choice(cities)
            alert_type = random.choice(["PRICE_DROP", "HIGH_DEMAND", "COMPETITOR_UNDERCUT"])
            
            if alert_type == "PRICE_DROP":
                msg = f"Average listing price dropped by {random.randint(5, 15)}% in {city}"
            elif alert_type == "HIGH_DEMAND":
                msg = f"Occupancy rates surging in {city}. Recommended rates increased."
            else:
                msg = f"New competitor pricing detected in {city}. Review model recommendations."

            alerts.append({
                "id": random.randint(1000, 9999),
                "city": city,
                "alert_type": alert_type,
                "message": msg,
                "timestamp": (datetime.now() - timedelta(minutes=random.randint(1, 60))).isoformat()
            })
            
        return Response({"alerts": alerts})

