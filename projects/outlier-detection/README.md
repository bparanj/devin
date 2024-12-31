# Outlier Detection Visualization

An interactive visualization tool for exploring and analyzing data points with outlier detection capabilities. Built with React, D3.js, and TypeScript.

## Features

- Interactive scatter plot visualization
- Distinct visual representation of outliers and normal points
- Toggle visibility of outlier points
- Hover tooltips showing point details
- File upload for custom datasets
- Sample data download functionality
- Responsive design with Tailwind CSS

## Data Format

The application expects JSON data in the following format:

```json
[
  {
    "id": "point1",
    "x": 1.0,
    "y": 1.5,
    "outlier": false
  }
]
```

### Data Requirements

- Each point must have:
  - `id`: A unique string identifier
  - `x`: Numeric x-coordinate
  - `y`: Numeric y-coordinate
  - `outlier`: Boolean flag indicating if the point is an outlier
- Dataset must contain at least 5 points
- All coordinates must be valid numbers
- Outlier field must be a boolean (true/false)

## Usage

1. **View Default Data**:
   - Launch the application to see the default dataset
   - Blue points represent normal data points
   - Red points represent outliers

2. **Toggle Outliers**:
   - Use the "Show Outliers" checkbox to show/hide outlier points
   - Helps focus on the main cluster or examine outliers

3. **Upload Custom Data**:
   - Click "Choose File" to upload your own JSON dataset
   - File must follow the specified data format
   - Invalid data will trigger error messages

4. **Download Sample Data**:
   - Click "Download Sample Data" to get an example dataset
   - Use this as a template for creating custom datasets

5. **Interact with Points**:
   - Hover over points to see detailed information
   - Information includes ID, coordinates, and outlier status

## Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

4. Preview production build:
   ```bash
   npm run preview
   ```

## Technologies Used

- React 18
- TypeScript
- D3.js for visualization
- Vite for build tooling
- Tailwind CSS for styling
