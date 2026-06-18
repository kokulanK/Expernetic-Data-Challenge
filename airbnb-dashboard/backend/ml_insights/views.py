from rest_framework import viewsets, mixins
from rest_framework.permissions import IsAuthenticated
from .models import MLMetric
from .serializers import MLMetricSerializer

class MLMetricViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = MLMetric.objects.all()
    serializer_class = MLMetricSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'metric_type'
