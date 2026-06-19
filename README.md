<div align="center">

# Expernetic Data Engineer Intern — Technical Assignment
### Inside Airbnb Market Intelligence: London & New York City

[![Live Dashboard](https://img.shields.io/badge/Dashboard-Live-success?style=flat-square)](https://expernetic-data-challenge.vercel.app/)
[![API Status](https://img.shields.io/badge/API-Render-46E3B7?style=flat-square)](https://expernetic-data-challenge.onrender.com)
[![HuggingFace Space](https://img.shields.io/badge/🤗%20Space-Price%20Predictor-FFD21E?style=flat-square)](https://huggingface.co/spaces/kokulan123/airbnb-price-predictor)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=flat-square&logo=python&logoColor=white)](https://www.python.org/)
[![Notebook](https://img.shields.io/badge/Notebook-Colab-F9AB00?style=flat-square&logo=googlecolab&logoColor=white)](./Expernetic_Notebook.ipynb)

**Author:** Kokulan Kugathasan 
· [GitHub](https://github.com/kokulanK) 
· [LinkedIn](https://linkedin.com/in/kokulan-kugathasan)

[Live Dashboard](https://expernetic-data-challenge.vercel.app/) 

· [API / Backend](https://expernetic-data-challenge.onrender.com) 
· [HF Space](https://huggingface.co/spaces/kokulan123/airbnb-price-predictor) 
· [Notebook](https://github.com/kokulanK/Expernetic-Data-Challenge/blob/main/Expernetic_Notebook.ipynb) 
· [Report](#report)

</div>

---

## Overview

This repository is my submission for Expernetic's Data Engineer Intern technical assignment — a real-world data challenge built on the [Inside Airbnb](https://insideairbnb.com/) public dataset. The brief was deliberately scoped beyond what's completable in a week; I prioritized **two cities analyzed in depth** over many cities analyzed shallowly, covering the full pipeline from raw ingestion through to a deployed, queryable analytics product.

| | |
|---|---|
| **Cities** | London, New York City |
| **Scope** | Ingestion → Cleaning → Star Schema → EDA → Statistics → ML → NLP → LLM Insights → Deployment |
| **Stack** | Python, pandas, DuckDB, scikit-learn, LightGBM, SHAP, Plotly, VADER, NMF |
| **Deployment** | React/Vite frontend (Vercel) + API backend (Render) |

> **City scope note:** Paris was evaluated and excluded — its `listings.csv.gz` scrape had an entirely unparseable `price` column. Including it would have silently inflated null rates across the master dataset.

---

## Live Deployment

| Component | Link | Notes |
|---|---|---|
| **Dashboard (frontend)** | [expernetic-data-challenge.vercel.app](https://expernetic-data-challenge.vercel.app/) | Interactive market explorer |
| **API (backend)** | [expernetic-data-challenge.onrender.com](https://expernetic-data-challenge.onrender.com) | Serves processed data + model predictions; kept warm via UptimeRobot |
| **HuggingFace Space** | [kokulan123/airbnb-price-predictor](https://huggingface.co/spaces/kokulan123/airbnb-price-predictor) | Gradio app — price prediction model + a Groq-powered chatbot for natural-language Q&A over the analysis |

Render's free tier spins down on inactivity — first request after idle may take 30–50s to respond while the instance wakes up.

---

## Repository Structure

```
.
Expernetic-Data-Challenge/
├── airbnb-dashboard/
├── airbnb-price-predictor/
├── .gitignore
├── Expernetic_Notebook.ipynb
├── README.md
├── Talent Assessment Program.pdf
├── error.txt
└── push_log.txt
```

*(Adjust the tree above to match your actual folder names before committing — see [Notes](#notes-before-you-push) below.)*

---

## Notebook Walkthrough

The notebook (`Expernetic_Notebook.ipynb`) is organized into 13 sequential sections, each building on the last:

| # | Section | What it does |
|---|---|---|
| 1 | Setup & Configuration | Dependencies, Drive mount, city config, calendar sampling limits |
| 2 | Dataset Familiarisation | File inventory, schema profiling, entity-relationship mapping |
| 3 | Ingestion Pipeline | `CityIngestionPipeline` class — retry logic, per-file metadata tracking |
| 4 | Data Profiling & Quality Report | Null rates, cardinality, exact + fuzzy duplicate detection, domain validation |
| 5 | Data Cleaning & Standardisation | Price parsing (currency symbols, NBSP artefacts), property type bucketing |
| 6 | Data Enrichment & Joining | Streaming calendar processor, occupancy/revenue estimates, neighbourhood aggregates |
| 7 | Data Modelling (Star Schema) | DuckDB warehouse — `dim_date`, `dim_property_type`, `fact_listing_snapshot`, `fact_calendar_daily` |
| 8 | Exploratory Data Analysis | Price distributions, host concentration, rating inflation, superhost effects |
| 9 | Statistical Analysis | 5 formal hypothesis tests with effect sizes (below) |
| 10 | ML Price Prediction | 3 model families compared, SHAP explainability, model export |
| 11 | Segmentation + Bias Check | K-Means clustering, cross-city model transfer test |
| 12 | NLP on Reviews | VADER sentiment, NMF topic modelling |
| 13 | LLM-Powered Insight Generation | Groq-generated executive summary over the full analysis (same Groq API also powers the chatbot in the deployed HF Space — see [Live Deployment](#live-deployment)) |

### Engineering decisions worth noting

- **DuckDB over PostgreSQL/SQLite** — columnar, in-process, zero-ops, and ideal for analytical queries directly on DataFrames.
- **Star schema, SCD-1** — Inside Airbnb is a point-in-time scrape with no change history to reconstruct, so overwrite-on-refresh is the correct (not lazy) choice.
- **Streaming calendar processing** — `calendar.csv.gz` is processed in chunks rather than loaded fully into memory, since it carries 365 rows per listing.
- **Cohen's d + rank-biserial reported together** — price data is heavily right-skewed, which deflates pooled-SD effect sizes; reporting both gives a robustness check.

---

## Key Findings

### Statistical tests (effect sizes, not just p-values)

| Hypothesis | Result | Effect size | Verdict |
|---|---|---|---|
| H1: Entire-home > private room price | Welch t=126.58, p<0.001 | Cohen's d=0.86 (large) | Entire-home listings cost ~2x more |
| H2: Superhosts get higher review scores | Welch t=86.31, p<0.001 | Cohen's d=0.44 (small) | Statistically real, practically marginal — both cluster above 4.5 |
| H3: >10 reviews → different pricing | Welch t=-21.94, p<0.001 | Cohen's d=-0.15 (negligible) | New listings underprice to attract early reviews (cold-start) |
| H4: Neighbourhood price differences | ANOVA F=131.44, p<0.001 | η²=0.177 | Location explains ~18% of price variance |
| H5: Weekend vs weekday pricing | — | — | **Untestable** — London's calendar price field was unparseable in this scrape (reported honestly, not forced) |

### ML price prediction

| Model | MAE | RMSE | MAPE |
|---|---|---|---|
| Ridge | $64.81 | $116.25 | 36.6% |
| Random Forest | $49.56 | $90.12 | 27.9% |
| **LightGBM (best)** | **$48.66** | **$88.29** | **26.8%** |

- SHAP confirms `accommodates` and neighbourhood-level price aggregates as the top drivers.
- **Cross-city transfer test:** training on London and evaluating on New York lifts MAE from $48.66 to $96.59 — a ~2x degradation confirming city-specific pricing dynamics aren't captured by shared features alone, and that a single global model would be biased toward whichever city dominates training data.

### NLP on reviews

- VADER sentiment correlates with star ratings at r=0.20 — directionally consistent but weak, because numerical scores are heavily compressed near 4.5–5.0 (rating inflation).
- NMF topic modelling (6 topics, 20k review sample) surfaces recurring themes: cleanliness, location/transport access, host communication, and value-for-money — plus two topics dominated by non-English reviews (German, French), indicating the corpus is multilingual and topic models trained on English stop-words alone will misrepresent a meaningful minority segment.

---

## Reproducing the Analysis

The notebook was built and run in **Google Colab** (it mounts Google Drive and reads API keys from Colab Secrets). To reproduce:

1. Open `Expernetic_Notebook.ipynb` in Colab.
2. Download city data from [Inside Airbnb's data page](https://insideairbnb.com/get-the-data/) for London and New York; place under your configured `DRIVE_BASE` path.
3. Run Section 1 to install dependencies and mount Drive.
4. (Optional) Add a `GROQ_API_KEY` to Colab Secrets to enable Section 13's LLM summary — set `USE_LLM = False` to skip.
5. Run all cells in order — later sections depend on DataFrames built earlier (`master_df`, `raw_data`, etc.).

To run locally instead of Colab, replace the Drive mount in Section 1 with a local path and swap the Colab Secrets calls for `os.environ`.

---

## HuggingFace Space — Price Predictor + Chatbot

Beyond the notebook, the trained LightGBM price model and the Groq LLM are deployed together as a Gradio app on HuggingFace Spaces: **[kokulan123/airbnb-price-predictor](https://huggingface.co/spaces/kokulan123/airbnb-price-predictor)**

- **Price prediction tab** — takes listing attributes (city, room type, accommodates, bedrooms, etc.) and returns a price estimate from the exported `price_model.joblib`, using city-level medians as defaults for neighbourhood aggregates a casual user wouldn't know.
- **Chatbot tab** — a Groq-powered conversational interface for asking natural-language questions about the analysis (e.g. "why is NYC more expensive than London?", "what drives price the most?"), grounded in the findings from the notebook rather than a generic LLM answering from scratch.

API key handling: the Groq key is stored as a HF Space secret, never hardcoded in the repo.

---

## Report

The full written report — Executive Summary, Methodology, Engineering Approach, all EDA/statistical/ML findings, Business Recommendations, Limitations, and the AI Usage Disclosure appendix — is included as a PDF under `reports/`.

---

## AI Usage Disclosure

AI tools (Claude, ChatGPT) were used throughout this assignment for code review, debugging, and drafting analytical narrative — consistent with Expernetic's stated AI usage policy. Full disclosure (tools used, AI-assisted sections, key prompts, validation steps, and rejected suggestions) is documented in **Appendix A of the PDF report**.

---
