# Dataset Variations Performance Visualization

A D3.js-powered visualization tool for comparing model performance across multiple datasets. This tool helps developers identify patterns in model performance across different data splits, such as training, validation, and test sets.

## Live Demo

Access the live visualization at: https://hyperparameter-impact-app-oz1nzckj.devinapps.com

## Features

- Interactive bar chart visualization comparing performance metrics across datasets
- Tooltips showing exact dataset names and metric values
- Click-to-highlight functionality for detailed comparison
- Custom data input support via JSON format
- Real-time data validation
- Responsive design for various screen sizes

## Data Format

The visualization expects an array of objects, each containing:
- `dataset`: Name or label of the dataset (e.g., "Training", "Validation", "Test")
- `metric`: Numeric performance measure (e.g., accuracy, F1-score)

Example:
```json
[
  { "dataset": "Training", "metric": 0.90 },
  { "dataset": "Validation", "metric": 0.85 },
  { "dataset": "Test", "metric": 0.80 }
]
```

## Validation Rules

1. Dataset Names:
   - Must be non-empty strings
   - Should be descriptive and unique

2. Metric Values:
   - Must be valid numbers
   - Typically between 0.0 and 1.0 for accuracy metrics
   - Other ranges supported for different metric types

3. Dataset Requirements:
   - Minimum of 2-3 entries for meaningful comparison
   - No duplicate dataset names

## Chart Layout

- **X-axis**: Displays dataset names with optimized label rotation
- **Y-axis**: Shows performance metric values
- **Bars**: Height represents the metric value for each dataset
- **Labels**: Clear labeling for both axes and chart title

## Interactive Features

1. **Tooltips**:
   - Hover over any bar to see exact values
   - Displays dataset name and metric value

2. **Highlighting**:
   - Click any bar to highlight it
   - Click again to remove highlight
   - Helps focus on specific datasets

3. **Custom Data Input**:
   - Paste custom JSON data
   - Real-time validation
   - Immediate visualization update

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd dataset-variations
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Technologies Used

- React
- TypeScript
- D3.js
- Tailwind CSS
- Vite

## Usage

1. Access the application through your web browser
2. View the default visualization showing sample data
3. To use custom data:
   - Prepare your data in the required JSON format
   - Paste it into the input field
   - The visualization will update automatically
4. Interact with the chart:
   - Hover over bars for detailed information
   - Click bars to highlight specific datasets
   - Compare performance across different datasets

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License
