---
title: Airbnb Price Predictor
emoji: 🏠
colorFrom: blue
colorTo: green
sdk: gradio
sdk_version: 4.44.0
app_file: app.py
pinned: false
license: mit
---

# Airbnb Price Predictor

A LightGBM model trained on Inside Airbnb data (London, New York) predicting
nightly listing price from property and host attributes. Built as part of a
data engineering internship technical assignment for Expernetic (Pvt) Ltd,
based on the publicly available [Inside Airbnb](https://insideairbnb.com/)
dataset.

## Model details

Trained on a log-transformed price target using a scikit-learn `Pipeline`
(median/most-frequent imputation → scaling/one-hot encoding → LightGBM
regressor). Three model families were trained and compared on the same
preprocessing pipeline and an 80/20 train/test split (`random_state=42`):

| Model | MAE (USD) | RMSE (USD) | MAPE |
|---|---|---|---|
| Ridge Regression | 64.81 | 116.25 | 36.6% |
| Random Forest | 49.56 | 90.12 | 27.9% |
| **LightGBM (selected)** | **48.66** | **88.29** | **26.8%** |

LightGBM was selected as the best-performing model on held-out test data and
is the model packaged with this Space.

**Cross-city transfer check:** training only on London and evaluating on
New York (i.e. testing whether the model generalises to a city it has never
seen) raises MAE to **$96.59 USD**, roughly double the in-distribution error.
This is reported transparently — see *Known limitations* below — rather than
treated as production-ready cross-market generalisation.

### Inputs / features

| Type | Features |
|---|---|
| Numeric | `accommodates`, `bedrooms`, `bathrooms`, `beds`, `minimum_nights`, `number_of_reviews`, `review_scores_rating`, `availability_365`, `host_tenure_years`, `nbhd_median_price`, `nbhd_listing_density`, `calculated_host_listings_count` |
| Categorical | `city`, `room_type_clean`, `property_type_bucket`, `host_portfolio_type` |

Numeric features are median-imputed and scaled; categorical features are
most-frequent-imputed and one-hot encoded (unknown categories at inference
time are handled gracefully rather than raising an error). The target
(`price`) is log1p-transformed during training and back-transformed
(`expm1`) on prediction, since nightly price is strongly right-skewed.
Prices above the 99th percentile were excluded from training as scraping
artefacts/outliers.

### Files in this Space

| File | Description |
|---|---|
| `app.py` | Gradio interface that loads the model and serves predictions |
| `models/price_model.joblib` | Fitted scikit-learn `Pipeline` (preprocessing + LightGBM) |
| `models/feature_schema.json` | Ordered list of numeric/categorical feature names expected by the pipeline |
| `models/city_defaults.json` | City-level median fallback values for fields a visitor can't supply directly (see below) |

## Known limitations

- New York's `host_since` field is 100% null in this data scrape, so
  `host_tenure_years` cannot be computed per-listing for NYC; this app
  falls back to a city-level default for that field, which is itself
  derived from imputation rather than a true NYC-specific value.
- `nbhd_median_price` / `nbhd_listing_density` use city-wide medians as a
  stand-in, since a website visitor describing a hypothetical listing can't
  supply true neighbourhood-level aggregates. Predictions for listings in
  unusually expensive or cheap neighbourhoods will be less accurate than the
  reported test-set MAE.
- The model was trained on two cities only; predictions outside London/NYC
  pricing dynamics should be treated as illustrative, not authoritative.
- Cross-city generalisation is weak (see transfer MAE above) — city is an
  important, non-interchangeable signal in this model, not a minor input.
- Prices were capped at the 99th percentile during training, so predictions
  for extreme luxury listings will tend to be conservative (under-predicted).

## Intended use

This model is a demonstration/educational artifact built for a technical
assessment, not a production pricing tool. It's intended to illustrate an
end-to-end ML workflow (feature engineering → model comparison →
explainability → deployment) on public Inside Airbnb data, and is consumed
by a companion full-stack dashboard via the Gradio API. It should not be
used to make real pricing or investment decisions without further
validation.

## Training data

[Inside Airbnb](https://insideairbnb.com/get-the-data/) public listings data
for London and New York City. See the accompanying analysis notebook and
PDF report for full data ingestion, cleaning, feature engineering, and
evaluation methodology.