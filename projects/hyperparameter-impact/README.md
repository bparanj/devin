# Hyperparameter Impact Visualization

An interactive visualization tool to explore how different hyperparameter settings affect machine learning model performance metrics.

## Live Demo

Visit the live demo at: https://hyperparameter-impact-app-ujd2zw23.devinapps.com

## Features

- Interactive bar chart visualization
- Tooltips showing exact parameter values and metrics
- Sorting functionality (ascending/descending by metric)
- Bar highlighting for easy comparison
- Custom data input support
- Real-time data validation

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Start the development server:
```bash
npm run dev
```

## Usage

### Default View
The application comes with sample data showing the impact of learning rates on model performance. You can interact with this visualization to:
- Hover over bars to see exact values
- Click bars to highlight them
- Sort the data using the "Sort by Metric" button

### Custom Data Input
You can input your own hyperparameter data in JSON format. The data must follow this structure:
```json
[
  { "paramValue": "parameter_setting", "metric": performance_value },
  ...
]
```

Example data is provided in `sample.json`.

### Data Validation Rules

Your input data must meet these criteria:
1. Minimum 3 different hyperparameter settings
2. Metric values must be between 0.0 and 1.0
3. Parameter values must be non-empty strings
4. Valid JSON format

## Built With

- React
- TypeScript
- D3.js
- Tailwind CSS
- shadcn/ui

## License

MIT License
