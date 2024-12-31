# Class Distribution Visualization

## Live Demo
Try the live demo: [Class Distribution Visualization](https://hyperparameter-impact-app-d5vmiopk.devinapps.com)

## Project Goal
This tool visualizes how many examples (or what percentage) fall into each class/category, helping users quickly identify class imbalances in their datasets. It provides an interactive bar chart visualization with real-time updates and data validation.

## Data Format
The visualization expects an array of objects, each containing:
- `class`: A string that identifies the class/category
- `count`: A numeric value indicating how many examples are in that class
- `percentage`: (Optional) Automatically calculated from the count

Example:
```json
[
  { "class": "Mammals", "count": 1250 },
  { "class": "Birds", "count": 850 },
  { "class": "Reptiles", "count": 420 },
  { "class": "Amphibians", "count": 380 },
  { "class": "Fish", "count": 650 }
]
```

## Validation Rules
- Input must be a valid JSON array
- Each object must have:
  - A non-empty `class` string
  - A non-negative `count` number
- Minimum of 2 classes required for meaningful comparison
- Invalid data will trigger error messages

## Chart Layout
- **Bar Chart**:
  - X-axis: Class names (rotated -30° for better readability)
  - Y-axis: Count of examples in each class
  - Each bar's height corresponds to the count
  - Bars are colored in slate gray (#64748b)
  - Selected bars highlighted in blue (#2563eb)

## Interactive Features
1. **Tooltips**:
   - Hover over any bar to see:
     - Class name
     - Exact count
     - Percentage of total

2. **Sorting**:
   - Click "Sort by Count" to order bars by count (descending)
   - Click "Reset Sort" to restore original order

3. **Bar Selection**:
   - Click any bar to highlight it
   - Click again to deselect

4. **Custom Data Input**:
   - Paste custom JSON data in the textarea
   - Real-time validation and error messages
   - Chart updates automatically on valid input

## Technologies Used
- React + TypeScript
- D3.js for visualization
- Tailwind CSS for styling
- shadcn/ui for UI components

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
4. Build for production:
   ```bash
   npm run build
   ```

## Usage Tips
1. Prepare your data in the correct JSON format
2. Copy and paste into the "Custom Data Input" textarea
3. Use the sorting feature to identify class imbalances
4. Hover over bars to see exact values
5. Click bars to highlight specific classes of interest
