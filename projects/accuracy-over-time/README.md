# Loss Visualization Chart

An interactive visualization tool for machine learning training runs that allows you to track and compare loss metrics across different training configurations.

## Features

- 📈 Visualize loss progression across training epochs
- 🔄 Support for multiple training runs with different parameters
- 📝 Interactive annotations for marking important points
- 🔍 Detailed tooltips showing exact values
- 📊 Responsive chart design
- 📁 JSON file upload support

## Sample Data Format

The application accepts JSON files with the following structure:

```json
[
  { "epoch": 1, "run": "lr=0.01,batch=32", "loss": 0.78 },
  { "epoch": 2, "run": "lr=0.01,batch=32", "loss": 0.66 },
  { "epoch": 3, "run": "lr=0.01,batch=32", "loss": 0.57 },
  { "epoch": 1, "run": "lr=0.001,batch=64", "loss": 0.92 },
  { "epoch": 2, "run": "lr=0.001,batch=64", "loss": 0.85 },
  { "epoch": 3, "run": "lr=0.001,batch=64", "loss": 0.75 }
]
```

Each data point requires:
- `epoch`: Training epoch number (integer)
- `run`: Configuration string (format: "lr={learning_rate},batch={batch_size}")
- `loss`: Loss value for that epoch (float)

## Local Development

1. Clone the repository:
```bash
git clone <repository-url>
cd accuracy-over-time-chart
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Production Deployment

1. Build the application:
```bash
npm run build
```

2. Preview the production build locally:
```bash
npm run preview
```

3. The built files will be in the `dist` directory, ready for deployment to your preferred hosting platform.

## Data Validation

The application includes built-in validation for uploaded JSON files:

- Checks for required fields (epoch, run, loss)
- Validates data types (epoch: integer, loss: number)
- Ensures run format follows the pattern "lr={value},batch={value}"
- Verifies that epochs are sequential within each run

## Usage Instructions

1. Launch the application
2. Click the "Upload JSON" button
3. Select your training data file
4. The chart will automatically update to display your data
5. Hover over data points to see detailed information
6. Click on the chart to add annotations for important points
7. Use the legend to toggle different training runs

## Sample Data

A sample data file is included in the repository at `scripts/sample_training_data.json`. You can use this to test the visualization features.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
