from django.db import models

class AnalyticsCache(models.Model):
    key = models.CharField(max_length=255, unique=True)
    data = models.JSONField()
    last_computed = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.key
