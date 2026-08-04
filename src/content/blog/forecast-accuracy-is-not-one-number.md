---
title: Forecast accuracy is not one number
date: 2026-06-18
description: Placeholder post. A single MAPE hides the two errors that actually cost money — the systematic bias and the tail.
tags: [forecasting, time-series]
draft: true
---

Placeholder content, written to exercise the prose styles and the timeline. Replace or delete
before launch.

## Why one number is not enough

A forecast reported as a single accuracy figure averages away the two failures that reach the
balance sheet: a persistent bias in one direction, and the handful of weeks where the error is
large enough to empty a shelf.

- Bias tells you the model is wrong in a fixable way
- Tail error tells you how much safety stock the wrongness costs
- The mean of the two tells you almost nothing

```python
def bias(actual: pd.Series, forecast: pd.Series) -> float:
    """Signed, not absolute — the sign is the whole point."""
    return (forecast - actual).mean() / actual.mean()
```
