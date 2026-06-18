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
data engineering internship technical assignment.

## Model details

Trained on a log-transformed price target using a scikit-learn Pipeline
(median/most-frequent imputation -> scaling/one-hot encoding -> LightGBM
regressor). Test-set MAE: $48.66 USD (in-distribution). Cross-city transfer
MAE (train London, test New York): $96.59 USD — see Known Limitations below.

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