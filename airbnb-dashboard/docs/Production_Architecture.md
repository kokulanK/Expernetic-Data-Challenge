# Production Architecture

## Overview
The Airbnb Price Prediction Intelligence Platform utilizes a modern, serverless-capable cloud architecture designed for scalability, high availability, and separation of concerns.

## Cloud Architecture Diagram

```mermaid
graph TD
    A[React Vite Frontend] -->|HTTPS / REST| B(API Gateway / Load Balancer)
    B --> C[Django REST API - ECS/Fargate]
    C --> D[(PostgreSQL - RDS)]
    C --> E[Redis - ElastiCache]
    C --> F[Hugging Face Inference API]
    C --> G[Groq API]
    
    subgraph Data Engineering & MLOps
    H[Jupyter Notebook Offline] -->|Export Metrics| D
    end
```

## Cost Estimates
- **Compute (Fargate)**: $40/month
- **Database (RDS)**: $15/month
- **Cache (ElastiCache)**: $15/month
- **Inference APIs**: Usage-based (approx. $10/month)
- **Total**: ~$80/month for baseline production.
