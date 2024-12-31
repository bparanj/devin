# Data Distribution and Overlap Visualization

An interactive D3.js visualization tool for exploring how data points from different classes distribute and overlap across feature space.

## Features

- Interactive scatter plot visualization with D3.js
- Color-coded points by class with dynamic legend
- Hover tooltips showing point details (ID and class)
- Class filtering/highlighting capabilities
- File upload for custom datasets
- Sample data download option
- Responsive axes and smooth transitions

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd data-distribution-overlap

# Install dependencies
npm install
# or
pnpm install

# Start development server
npm run dev
# or
pnpm dev
```

### Building for Production

```bash
npm run build
# or
pnpm build
```

## Data Format

The application expects JSON data in the following format:

```json
[
  { "id": "point1", "x": 2.0, "y": 1.5, "class": "A" },
  { "id": "point2", "x": 2.2, "y": 1.6, "class": "A" },
  { "id": "point3", "x": 3.0, "y": 2.2, "class": "B" }
]
```

### Data Requirements

- Each point must have:
  - `id`: Unique identifier string
  - `x`: Numeric value for x-axis
  - `y`: Numeric value for y-axis
  - `class`: String label (e.g., "A", "B", "C")
- Minimum 6 points required
- At least 2 different classes
- Values must be valid numbers for x and y coordinates

## Usage

1. **View Default Data**
   - Launch the application to see the default visualization
   - Points are color-coded by class
   - Hover over points to see ID and class details
   - Use the legend to toggle class visibility

2. **Upload Custom Data**
   - Click "Choose File" to upload your JSON data
   - Data must follow the specified format
   - Invalid data will trigger error messages
   - Minimum of 6 points required

3. **Download Sample Data**
   - Click "Download Sample" to get example data
   - Sample data is different from default display data
   - Use this as a template for your own datasets

4. **Interact with Visualization**
   - Toggle classes using the legend
   - Hover over points for tooltips
   - Observe overlap between different classes
   - Use class filtering to focus on specific patterns

## Technologies Used

- React 18
- TypeScript
- D3.js
- Tailwind CSS
- Vite

## Project Structure

```
data-distribution-overlap/
├── src/
│   ├── App.tsx           # Main application component
│   ├── types/            # TypeScript definitions
│   │   └── index.ts
│   └── utils/            # Utility functions
│       └── validation.ts
├── public/              # Public assets
│   ├── example-data.json # Default display data
│   ├── sample-data.json  # Downloadable sample
│   └── test-data.json   # Additional test data
└── README.md
```


## Development

### Code Style

- TypeScript for type safety
- Functional components with React hooks
- D3.js for data visualization
- Tailwind CSS for styling

### Data Validation

The application validates:
- Numeric values for coordinates
- Required fields presence
- Minimum dataset size (6+ points)
- Class label consistency
- Data format integrity

## License

MIT License - feel free to use and modify for your own projects.
