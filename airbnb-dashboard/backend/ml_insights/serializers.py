from rest_framework import serializers
from .models import MLMetric

class MLMetricSerializer(serializers.ModelSerializer):
    class Meta:
        model = MLMetric
        fields = '__all__'
