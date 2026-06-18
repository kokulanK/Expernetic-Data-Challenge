# Novel Analytical Approach

## Overview
In addition to standard predictive metrics (RMSE, MAE), we implement a novel analytical lens focusing on **Host Portfolio Segmentation vs. Pricing Elasticity**.

## Methodology
Instead of merely predicting the price based on property features (bedrooms, location), we cluster hosts into distinct segments:
1. **The Casual Host** (1 property, high availability, low reviews)
2. **The Professional Manager** (Multiple properties, strict minimum nights, high reviews)
3. **The Premium Experience Host** (1-2 properties, very high review scores, low availability)

### Why is this novel?
Standard models often treat 'Host Portfolio Type' as just another categorical variable. By explicitly analyzing model bias and error rates *across* these specific clusters, we provide actionable intelligence. For instance, we can demonstrate to a "Casual Host" how much potential revenue they are losing compared to a "Professional Manager" with an identical property in the same neighborhood. This transforms the tool from a mere "price calculator" into a "revenue strategy consultant."
