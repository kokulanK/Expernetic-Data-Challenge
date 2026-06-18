from django.db import models
from django.conf import settings

class Prediction(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='predictions')
    city = models.CharField(max_length=100)
    room_type = models.CharField(max_length=100)
    property_type = models.CharField(max_length=100)
    accommodates = models.IntegerField()
    bedrooms = models.IntegerField()
    bathrooms = models.FloatField()
    beds = models.IntegerField()
    minimum_nights = models.IntegerField()
    availability_365 = models.IntegerField()
    number_of_reviews = models.IntegerField()
    review_scores_rating = models.FloatField()
    host_portfolio_type = models.CharField(max_length=100)
    
    predicted_price = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.city} - {self.room_type} - ${self.predicted_price}"
