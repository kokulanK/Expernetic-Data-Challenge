from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Avg, Count, Max, Min
from predictions.models import Prediction

class AnalyticsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        qs = Prediction.objects.filter(user=request.user)
        
        total_predictions = qs.count()
        avg_price = qs.aggregate(Avg('predicted_price'))['predicted_price__avg'] or 0
        max_price = qs.aggregate(Max('predicted_price'))['predicted_price__max'] or 0
        min_price = qs.aggregate(Min('predicted_price'))['predicted_price__min'] or 0

        # City distribution
        city_dist = list(qs.values('city').annotate(count=Count('id'), avg_price=Avg('predicted_price')))
        
        # Property type distribution
        prop_dist = list(qs.values('property_type').annotate(count=Count('id')))
        
        # Room type distribution
        room_dist = list(qs.values('room_type').annotate(count=Count('id')))

        return Response({
            "kpis": {
                "total_predictions": total_predictions,
                "avg_price": round(avg_price, 2),
                "max_price": round(max_price, 2),
                "min_price": round(min_price, 2),
            },
            "charts": {
                "city_performance": city_dist,
                "property_types": prop_dist,
                "room_types": room_dist,
            }
        })
