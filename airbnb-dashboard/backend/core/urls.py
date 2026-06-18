from django.contrib import admin
from django.urls import path, include

from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
   openapi.Info(
      title="Airbnb Intelligence API",
      default_version='v1',
      description="API for Airbnb Price Prediction Platform",
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Swagger docs
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    
    # API endpoints
    path('api/auth/', include('accounts.urls')),
    path('api/', include('predictions.urls')),
    path('api/', include('chatbot.urls')),
    path('api/', include('ml_insights.urls')),
    path('api/', include('analytics.urls')),
    path('api/', include('streaming_sim.urls')),
    path('api/', include('automated_reporting.urls')),
]
