from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MLMetricViewSet

router = DefaultRouter()
router.register(r'ml-insights', MLMetricViewSet, basename='mlmetric')

urlpatterns = [
    path('', include(router.urls)),
]
