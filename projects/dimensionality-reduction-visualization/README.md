# Dimensionality Reduction Visualization

An interactive visualization tool for exploring dimensionality reduction results. This application helps visualize how high-dimensional data (e.g., 10, 50, or 100+ features per sample) can be projected into 2D space using techniques like PCA, t-SNE, or UMAP.

## Features

- Interactive 2D scatter plot visualization
- Color-coded clusters/classes
- Tooltips showing point details
- File upload for custom data
- Sample data download
- Responsive design

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

## Usage Instructions

1. **Upload Your Data**
   - Click the "Upload Data" button
   - Select a JSON file containing your dimensionality reduction results
   - File must follow the required format (see below)

2. **Interact with the Visualization**
   - Points are automatically color-coded by their cluster/class
   - Hover over points to see detailed information
   - Use mouse wheel to zoom in/out
   - Click and drag to pan the view

3. **Sample Data**
   - Click "Download Sample Data" to get an example file
   - Use this as a template for formatting your own data

## Data Format

The application expects JSON data in the following format:

```json
[
  {
    "id": "point1",
    "x": 2.3,
    "y": -1.1,
    "label": "Cluster A"
  },
  {
    "id": "point2",
    "x": -0.8,
    "y": 1.9,
    "label": "Cluster B"
  }
]
```

### Data Requirements

- Each point must have:
  - `id`: Unique identifier (string)
  - `x`: X-coordinate after dimensionality reduction (number)
  - `y`: Y-coordinate after dimensionality reduction (number)
  - `label`: (Optional) Cluster or class label (string)
- Minimum 5 data points required
- All coordinates must be valid numbers

## Built With

- React + TypeScript
- D3.js
- Recharts
- Tailwind CSS
- shadcn/ui

## License

This project is licensed under the MIT License.
