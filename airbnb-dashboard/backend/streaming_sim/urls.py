from django.urls import path
from .views import StreamingSimView

urlpatterns = [
    path('stream-alerts/', StreamingSimView.as_view(), name='stream-alerts'),
]
