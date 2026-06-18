import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from predictions.models import Prediction

def purge_data():
    count, _ = Prediction.objects.all().delete()
    print(f"Purged {count} dummy predictions from the database.")

if __name__ == '__main__':
    purge_data()
