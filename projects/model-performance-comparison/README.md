# Model Performance Comparison Visualization

An interactive D3.js visualization tool for comparing performance metrics across different machine learning models.

## Live Demo
Visit the live demo: [Model Performance Comparison Visualization](https://next-content-app-3sxcxwzs.devinapps.com)

## Features

- Interactive bar chart visualization using D3.js
- Real-time sorting of models by performance
- Detailed tooltips showing exact metric values
- Model highlighting for focused comparison
- File upload/download functionality for custom data
- Responsive design for various screen sizes
- Type-safe data validation

## Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd model-performance-comparison

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Usage

1. **Default View**: 
   - Loads with traditional ML models (Random Forest, SVM, etc.)
   - Performance metrics range: 0.78-0.88

2. **Interactive Features**:
   - Hover over bars to see exact metric values
   - Click bars to highlight specific models
   - Use the sort button to reorder models by performance

3. **Custom Data**:
   - Download sample data using the "Download Sample Data" button
   - Upload your own data using the "Upload Data" button
   - Data must follow the specified format (see below)

## Data Format

The application expects JSON data in the following format:

```json
[
  { "model": "Model Name", "metric": 0.85 },
  { "model": "Another Model", "metric": 0.78 }
]
```

Requirements:
- `model`: String - Name of the machine learning model
- `metric`: Number - Performance metric value between 0 and 1
- Minimum of 2 models required
- Each model must have both properties

## Sample Data

The included sample data (`sample-data.json`) provides an example with deep learning models:
- Models: BERT-base, GPT-2 Small, ResNet-50, LSTM, T5-small, ViT, RoBERTa, DenseNet
- Performance metrics range: 0.234-0.567

This sample data is intentionally different from the default display to demonstrate the visualization's flexibility.

## Development

Built with:
- React + TypeScript for the frontend
- D3.js for data visualization
- Vite as the build tool
- Tailwind CSS for styling

### Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
model-performance-comparison/
├── src/
│   ├── App.tsx           # Main application component
│   ├── types/            # TypeScript type definitions
│   │   └── index.ts
│   └── utils/            # Utility functions
├── public/
│   └── sample-data.json  # Sample data file
└── package.json
```

## License

MIT License - feel free to use this project for your own purposes.
