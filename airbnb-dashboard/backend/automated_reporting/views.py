import io
from django.http import FileResponse
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from predictions.models import Prediction

class GenerateReportView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        prediction_id = request.query_params.get('prediction_id')
        prediction = None
        if prediction_id:
            try:
                prediction = Prediction.objects.get(id=prediction_id, user=request.user)
            except Prediction.DoesNotExist:
                pass
        
        buffer = io.BytesIO()
        p = canvas.Canvas(buffer, pagesize=letter)
        
        p.setFont("Helvetica-Bold", 24)
        p.drawString(100, 750, "Airbnb Property Price Estimate")
        
        p.setFont("Helvetica", 12)
        p.drawString(100, 700, f"Generated for: {request.user.username}")
        
        if prediction:
            p.drawString(100, 660, f"City: {prediction.city}")
            p.drawString(100, 640, f"Property Type: {prediction.property_type}")
            p.drawString(100, 620, f"Room Type: {prediction.room_type}")
            p.drawString(100, 600, f"Accommodates: {prediction.accommodates}")
            p.drawString(100, 580, f"Bedrooms: {prediction.bedrooms}")
            p.drawString(100, 560, f"Bathrooms: {prediction.bathrooms}")
            
            p.setFont("Helvetica-Bold", 16)
            p.drawString(100, 500, f"Predicted Price: ${prediction.predicted_price:.2f} / night")
        else:
            p.drawString(100, 660, "No specific prediction selected.")
            p.drawString(100, 640, "Make a prediction first to generate a detailed report.")
            
        p.showPage()
        p.save()
        
        buffer.seek(0)
        return FileResponse(buffer, as_attachment=True, filename='prediction_report.pdf')
