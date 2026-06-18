import gradio as gr
import joblib
import json
import pandas as pd
import numpy as np

model = joblib.load("price_model.joblib")
with open("city_defaults.json") as f:
    CITY_DEFAULTS = json.load(f)
with open("feature_schema.json") as f:
    SCHEMA = json.load(f)

CITIES = list(CITY_DEFAULTS.keys())


def predict_price(city, room_type, property_type, accommodates, bedrooms,
                   bathrooms, beds, minimum_nights, availability_365,
                   number_of_reviews, review_scores_rating, host_portfolio_type):
    defaults = CITY_DEFAULTS[city]

    row = pd.DataFrame([{
        "city": city,
        "room_type_clean": room_type,
        "property_type_bucket": property_type,
        "accommodates": accommodates,
        "bedrooms": bedrooms,
        "bathrooms": bathrooms,
        "beds": beds,
        "minimum_nights": minimum_nights,
        "number_of_reviews": number_of_reviews,
        "review_scores_rating": review_scores_rating,
        "availability_365": availability_365,
        "host_tenure_years": defaults["host_tenure_years"],
        "nbhd_median_price": defaults["nbhd_median_price"],
        "nbhd_listing_density": defaults["nbhd_listing_density"],
        "calculated_host_listings_count": 1 if host_portfolio_type == "Single listing" else 5,
        "host_portfolio_type": host_portfolio_type,
    }])

    log_pred = model.predict(row)[0]
    price = float(np.expm1(log_pred))
    return f"${price:,.2f} per night"


with gr.Blocks(title="Airbnb Price Predictor") as demo:
    gr.Markdown(
        "# Airbnb Price Predictor\n"
        "Estimate nightly price from listing attributes. Trained on London and "
        "New York Inside Airbnb data — see the Space README for model details "
        "and known limitations."
    )

    with gr.Row():
        city = gr.Dropdown(CITIES, value=CITIES[0], label="City")
        room_type = gr.Dropdown(
            ["Entire home/apt", "Private room", "Shared room", "Hotel room"],
            value="Entire home/apt", label="Room type"
        )
        property_type = gr.Dropdown(
            ["Apartment", "House", "Condo", "Other"],
            value="Apartment", label="Property type"
        )

    with gr.Row():
        accommodates = gr.Slider(1, 16, value=4, step=1, label="Accommodates")
        bedrooms = gr.Slider(0, 10, value=1, step=1, label="Bedrooms")
        bathrooms = gr.Slider(0, 6, value=1, step=0.5, label="Bathrooms")
        beds = gr.Slider(1, 10, value=2, step=1, label="Beds")

    with gr.Accordion("Advanced (host & demand attributes)", open=False):
        minimum_nights = gr.Slider(1, 30, value=2, step=1, label="Minimum nights")
        availability_365 = gr.Slider(0, 365, value=180, step=1, label="Days available per year")
        number_of_reviews = gr.Slider(0, 500, value=20, step=1, label="Number of reviews")
        review_scores_rating = gr.Slider(0, 5, value=4.7, step=0.1, label="Review score")
        host_portfolio_type = gr.Dropdown(
            ["Single listing", "Multi-listing"],
            value="Single listing", label="Host type"
        )

    predict_btn = gr.Button("Predict price", variant="primary")
    output = gr.Textbox(label="Estimated nightly price")

    predict_btn.click(
        predict_price,
        inputs=[city, room_type, property_type, accommodates, bedrooms, bathrooms, beds,
                minimum_nights, availability_365, number_of_reviews, review_scores_rating,
                host_portfolio_type],
        outputs=output
    )

demo.launch()