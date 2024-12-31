# Classification Boundaries Visualization

An interactive visualization tool for exploring classification model decision boundaries using D3.js and React.

## Overview

This application helps users understand how classification models separate data points belonging to different classes by visualizing:
- Data points with their actual class labels
- Decision boundaries showing how the model classifies different regions
- Interactive features for exploring the classification space

## Features

- Interactive scatter plot visualization
- Real-time tooltips showing point details
- Color-coded class visualization
- File upload for custom datasets
- Sample data download
- Responsive design with automatic scaling
- Support for multiple classes

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Data Format

The application expects JSON data in the following format:

### Points Data
Array of objects representing data samples:
```json
{
  "points": [
    {
      "id": "point1",
      "x": 0.5,
      "y": 1.0,
      "class": "A"
    }
  ]
}
```

### Boundary Data
Set of x-y pairs showing model classifications:
```json
{
  "boundary": [
    {
      "x": -2.0,
      "y": -2.0,
      "predictedClass": "A"
    }
  ]
}
```

### Validation Rules

1. All x and y coordinates must be valid numbers
2. Each point must have a unique id
3. Class labels must be strings
4. Boundary data should cover the range of point coordinates

## Usage

1. **View Default Visualization**
   - Launch the application
   - Observe the default classification scenario
   - Hover over points to see details
   - Use the legend to highlight classes

2. **Upload Custom Data**
   - Click "Upload Data"
   - Select a JSON file following the specified format
   - Visualization updates automatically

3. **Download Sample Data**
   - Click "Download Sample"
   - Use the downloaded JSON as a template
   - Modify for your use case

## Sample Data

Two sample datasets are included:

1. `public/sample-data.json`: Default visualization data showing basic two-class classification
2. `public/test-data.json`: Alternative dataset demonstrating complex boundaries with three classes arranged in a circular pattern

## Project Structure

```
classification-boundaries/
├── src/
│   ├── App.tsx           # Main visualization component
│   ├── types/            # TypeScript type definitions
│   └── ...
├── public/
│   ├── sample-data.json  # Default visualization data
│   └── test-data.json    # Downloadable sample data
└── ...
```

## Technologies

- React 18
- TypeScript
- D3.js
- Vite
- Tailwind CSS
- shadcn/ui

## License

MIT License - Feel free to use and modify for your needs.
