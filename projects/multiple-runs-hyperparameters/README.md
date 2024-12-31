# Multiple Runs Hyperparameters Visualization

An interactive D3.js visualization tool for comparing multiple training runs with different hyperparameter configurations. This tool helps in analyzing how different hyperparameter settings affect model training performance.

## Features

- Interactive line chart comparing multiple training runs
- Dynamic tooltips showing detailed metrics at each point
- Interactive legend with highlighting for specific configurations
- File upload support for custom datasets
- Automatic axis scaling based on data ranges
- Color-coded lines for easy differentiation between runs

## Quick Start

### Local Development

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:5173](http://localhost:5173) in your browser

### Production Deployment

1. Build the project:
```bash
npm run build
```

2. Deploy the contents of the `dist` directory to any static hosting service.

## Data Format

The visualization accepts JSON files with the following structure:

```json
[
  {
    "epoch": 1,
    "run": "lr=0.01,batch=32",
    "loss": 0.90
  },
  {
    "epoch": 2,
    "run": "lr=0.01,batch=32",
    "loss": 0.78
  }
]
```

Required fields for each data point:
- `epoch`: Training epoch number (integer)
- `run`: Hyperparameter configuration identifier (string)
- `loss`: Loss value for that epoch (number)

## Sample Data

Two sample datasets are included:
1. `sample-data.json`: Basic example with two configurations
2. `comprehensive-test-data.json`: Extended dataset with multiple learning rates and batch sizes

## Usage Guide

1. **Viewing Data**:
   - Load the page to see the default visualization
   - Use the file input to upload your own JSON data
   - Click "Reset to Sample Data" to return to the default dataset

2. **Interacting with the Chart**:
   - Hover over lines to see detailed values at each epoch
   - Click legend items to highlight specific configurations
   - Double-click the legend to reset highlighting

3. **Understanding the Visualization**:
   - X-axis shows training epochs
   - Y-axis displays loss values
   - Each line represents a different hyperparameter configuration
   - Line colors are automatically assigned to different runs

## Technical Stack

- React 18
- TypeScript 5
- D3.js for visualization
- Vite for build tooling
- Tailwind CSS for styling

## Requirements

- Node.js >= 18
- npm >= 9

## Project Structure

```
├── src/
│   ├── App.tsx         # Main application component
│   ├── App.css         # Styles
│   └── types/          # TypeScript definitions
├── public/
│   ├── sample-data.json
│   └── comprehensive-test-data.json
└── package.json
```

## License

MIT License - Feel free to use and modify for your needs.
