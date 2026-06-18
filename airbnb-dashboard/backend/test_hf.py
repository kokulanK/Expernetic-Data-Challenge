from gradio_client import Client

client = Client("kokulan123/airbnb-price-predictor")

try:
    result = client.predict(
        city="London",
        room_type="Entire home/apt",
        property_type="Apartment",
        accommodates=4.0,
        bedrooms=2.0,
        bathrooms=1.0,
        beds=2.0,
        minimum_nights=2.0,
        availability_365=180.0,
        number_of_reviews=10.0,
        review_scores_rating=4.5,
        host_portfolio_type="Single listing",
        api_name="/predict_price"
    )
    print("Result:", result)
except Exception as e:
    print("Error:", e)
