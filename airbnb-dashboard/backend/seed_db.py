import os
import django
import random
from datetime import datetime, timedelta

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth import get_user_model
from predictions.models import Prediction

User = get_user_model()

def seed():
    # 1. Create or get test user
    username = 'admin'
    password = 'admin123'
    email = 'admin@example.com'
    
    user, created = User.objects.get_or_create(username=username, defaults={
        'email': email,
        'is_staff': True,
        'is_superuser': True
    })
    user.is_staff = True
    user.is_superuser = True
    user.set_password(password)
    user.save()
    if created:
        print(f"Created user: {username} / {password}")
    else:
        print(f"Updated user password to: {username} / {password}")

    # Clear old predictions
    Prediction.objects.filter(user=user).delete()
    print("Cleaned up old predictions.")

    # 2. Seed realistic predictions for London and New York
    cities = ['London', 'New York']
    room_types = ['Entire home/apt', 'Private room', 'Shared room', 'Hotel room']
    property_types = ['Apartment', 'House', 'Condo', 'Other']
    host_portfolio_types = ['Single listing', 'Multi-listing']

    print("Seeding predictions...")
    for i in range(25):
        city = random.choice(cities)
        room_type = random.choice(room_types)
        property_type = random.choice(property_types)
        host_portfolio_type = random.choice(host_portfolio_types)
        
        # Accommodates 1-8
        accommodates = random.randint(1, 8)
        bedrooms = random.randint(1, max(1, accommodates - 1))
        beds = random.randint(bedrooms, accommodates)
        bathrooms = float(random.choice([1.0, 1.5, 2.0, 2.5]))
        
        minimum_nights = random.randint(1, 7)
        availability_365 = random.randint(30, 300)
        number_of_reviews = random.randint(0, 150)
        review_scores_rating = round(random.uniform(3.5, 5.0), 1)
        
        # Base price calculations to look somewhat realistic
        base_price = 100 if city == 'London' else 140
        if room_type == 'Entire home/apt':
            base_price *= 1.8
        elif room_type == 'Shared room':
            base_price *= 0.5
            
        base_price += (accommodates * 15) + (bedrooms * 20) + (bathrooms * 25)
        predicted_price = round(base_price + random.uniform(-20, 20), 2)

        pred = Prediction.objects.create(
            user=user,
            city=city,
            room_type=room_type,
            property_type=property_type,
            accommodates=accommodates,
            bedrooms=bedrooms,
            bathrooms=bathrooms,
            beds=beds,
            minimum_nights=minimum_nights,
            availability_365=availability_365,
            number_of_reviews=number_of_reviews,
            review_scores_rating=review_scores_rating,
            host_portfolio_type=host_portfolio_type,
            predicted_price=predicted_price
        )
        # Randomize date created
        pred.created_at = datetime.now() - timedelta(days=random.randint(0, 14))
        pred.save()

    print(f"Successfully seeded {Prediction.objects.filter(user=user).count()} predictions.")

if __name__ == '__main__':
    seed()
