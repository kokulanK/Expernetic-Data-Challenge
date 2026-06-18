from django.db import models

class MLMetric(models.Model):
    metric_type = models.CharField(max_length=50, unique=True, help_text="e.g., 'model_comparison', 'feature_importance', 'shap_summary', 'bias_report', 'clusters'")
    data = models.JSONField(help_text="Stores the structured JSON output from the offline Jupyter notebook")
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.metric_type
