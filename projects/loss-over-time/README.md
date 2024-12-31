Below is a sample JSON dataset you can use to demonstrate a “Loss over Time” chart with interactive features. It shows a general downward trend in loss but includes a small spike to highlight variability:

```json
[
  { "epoch": 1,  "loss": 0.95 },
  { "epoch": 2,  "loss": 0.80 },
  { "epoch": 3,  "loss": 0.70 },
  { "epoch": 4,  "loss": 0.58 },
  { "epoch": 5,  "loss": 0.52 },
  { "epoch": 6,  "loss": 0.49 },
  { "epoch": 7,  "loss": 0.62 },  // Notice the spike
  { "epoch": 8,  "loss": 0.48 },
  { "epoch": 9,  "loss": 0.42 },
  { "epoch": 10, "loss": 0.35 },
  { "epoch": 11, "loss": 0.32 },
  { "epoch": 12, "loss": 0.28 }
]
```

Use this data to:
1. Draw your line chart.  
2. Implement hover or click events to show exact `epoch` and `loss`.  
3. Highlight the spike at epoch 7 and how the loss recovers afterward.

The app includes the following features:

1. Data Input:
   - Accepts JSON array in format: `[{"epoch": number, "loss": number}, ...]`
   - Validates data structure and numeric values
   - Supports both small and large datasets
   - Shows clear error messages for invalid input

2. Interactive Features:
   - Enhanced tooltips showing:
     * Exact loss value
     * Improvement percentage
     * Training phase analysis
   - Visual feedback:
     * Points highlight on hover
     * Color changes to indicate focus
   - Zoom and pan capabilities:
     * Use mouse wheel to zoom in/out
     * Click and drag to pan around

3. Training Phase Analysis:
   The app automatically identifies and displays different training phases:
   - Initial training
   - Rapid improvement (>20% improvement)
   - Gradual improvement
   - Possible plateau (<2% improvement)
   - Warning for loss increases

To test the app, you can use this sample data:
```json
[
  {"epoch": 1, "loss": 1.0},
  {"epoch": 2, "loss": 0.8},
  {"epoch": 3, "loss": 0.6},
  {"epoch": 4, "loss": 0.4},
  {"epoch": 5, "loss": 0.3},
  {"epoch": 6, "loss": 0.25},
  {"epoch": 7, "loss": 0.22},
  {"epoch": 8, "loss": 0.21},
  {"epoch": 9, "loss": 0.20},
  {"epoch": 10, "loss": 0.19}
]
```
