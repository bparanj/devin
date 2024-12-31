# Correlation Matrix Visualization

An interactive visualization tool for exploring correlations between different features in your dataset. Built with React, TypeScript, and D3.js. Try it live at: https://hyperparameter-impact-app-123rh54l.devinapps.com

## Features

- Interactive heatmap visualization with square cells for clear correlation representation
- Dynamic color scales:
  - Blue-Red: Blue for positive, Red for negative correlations
  - Green-Red: Green for positive, Red for negative correlations
- Interactive features:
  - Hover tooltips showing exact correlation values
  - Row and column highlighting for relationship analysis
  - Opacity changes for better focus on related correlations
- Real-time data validation:
  - JSON format validation
  - Matrix size and symmetry checks
  - Correlation value range (-1 to 1) validation
- Custom data input with immediate visual feedback
- Responsive design adapting to various screen sizes

## Data Format

The visualization expects JSON data in the following format:

```json
{
  "features": ["Age", "Income", "Education", "CreditScore"],
  "matrix": [
    [ 1.00,  0.65,  0.32,  0.78 ],
    [ 0.65,  1.00,  0.45,  0.25 ],
    [ 0.32,  0.45,  1.00,  0.11 ],
    [ 0.78,  0.25,  0.11,  1.00 ]
  ]
}
```

### Requirements:

1. The `features` array must contain at least 2 feature names
2. The `matrix` must be square (NxN) and match the length of `features`
3. All correlation values must be between -1.0 and 1.0
4. Diagonal values should be 1.0 (perfect self-correlation)

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open http://localhost:5173 in your browser

## Usage

1. The visualization loads with sample data showing correlations between academic subjects
2. To use your own data:
   - Prepare your correlation matrix in the required JSON format
   - Paste it into the "Custom Data Input" textarea
   - The visualization will update automatically if the data is valid
3. Toggle between color scales using the buttons above the visualization
4. Hover over cells to see detailed correlation information
5. Click on cells to highlight related rows and columns

## Sample Data

A sample dataset (`sample.json`) is included in the repository, demonstrating correlations between different academic subjects. You can use this as a template for formatting your own data.

## Development

Built with:
- React + TypeScript
- D3.js for visualization
- Tailwind CSS for styling
- shadcn/ui for UI components

## License

MIT License - Feel free to use and modify for your own projects!
