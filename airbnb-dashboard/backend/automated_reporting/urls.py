from django.urls import path
from .views import GenerateReportView

urlpatterns = [
    path('report/', GenerateReportView.as_view(), name='generate-report'),
]
