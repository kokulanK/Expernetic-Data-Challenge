# Cost Optimization Design

## Overview
To support a global-scale rollout of the Airbnb Price Prediction Platform while keeping operational costs low, we propose several architectural optimizations.

## 1. Inference Caching
Since predicting prices for the exact same set of parameters (city, property type, accommodates, etc.) is deterministic for a given model version, we implement **Redis Caching** at the API layer.
- **Cache Hit Ratio Expectation**: ~40%
- **Cost Savings**: Reduces Hugging Face API calls and compute overhead.

## 2. Serverless Scaling
Instead of provisioning EC2 instances that sit idle, we utilize **AWS Fargate** or **Google Cloud Run**. These scale to 0 during low-traffic periods (e.g., night time in target regions).

## 3. Database Connection Pooling
Using **PgBouncer** reduces the memory overhead of maintaining open PostgreSQL connections, allowing a smaller, cheaper database instance to handle thousands of concurrent users.

## 4. Batch Processing for Analytics
Instead of calculating complex analytics (e.g., average prediction price across millions of rows) on the fly, we use a scheduled **Celery** task to compute these overnight and store them in the `analytics_cache` table.
